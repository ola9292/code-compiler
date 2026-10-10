import Book from '../db/models/Book.js';
import Transaction from '../db/models/Transaction.js';

export async function index(req, res)
{
  try{
    const data = await Book.find()
    return res.render('index', {data})
  }catch(err){
    console.log(err)
  }
}

export async function show(req, res)
{
  const id = req.params.id
  try{
    const data = await Book.findById(id)
    return res.render('show', {data})
  }catch(err){
    console.log(err)
  }
}
export async function create(req, res)
{
  return res.render('create')
}
export async function store(req, res)
{
 const {name, author, pages, price} = req.body
 const errors = {};

  // 1. Manual validation checks
  if (!name || name.trim() === '') {
      errors.name = 'Book name is required.';
  }
  if (!author || author.trim() === '') {
      errors.author = 'Author name is required.';
  }
  if (!pages || isNaN(pages) || Number(pages) <= 0) {
      errors.pages = 'Pages must be a valid number greater than 0.';
  }
  if (!price || isNaN(price) || Number(price) < 0) {
      errors.price = 'Price must be a valid positive number.';
  }

  // 2. If validation fails, re-render form with errors and old input
  if (Object.keys(errors).length > 0) {
      return res.render('books/create', { errors, oldInput: req.body });
  }

  try{
      const newBook = new Book({
        name: name,
        author: author,
        pages:pages,
        price:price
      });

      await Book.create(newBook);
    return res.redirect('/');
  }catch(err){
    console.log(err)
  }
}

export async function edit(req, res)
{
   const id = req.params.id
  try{
    const data = await Book.findById(id)
    return res.render('edit', {data})
  }catch(err){
    console.log(err)
  }
}
export async function update(req, res)
{
   const {name, author, pages, price} = req.body

   const errors = {};

    // 1. Manual validation checks
    if (!name || name.trim() === '') {
        errors.name = 'Book name is required.';
    }
    if (!author || author.trim() === '') {
        errors.author = 'Author name is required.';
    }
    if (!pages || isNaN(pages) || Number(pages) <= 0) {
        errors.pages = 'Pages must be a valid number greater than 0.';
    }
    if (!price || isNaN(price) || Number(price) < 0) {
        errors.price = 'Price must be a valid positive number.';
    }

    // 2. If validation fails, re-render the edit form with errors and input data
    if (Object.keys(errors).length > 0) {
        return res.render('books/edit', { 
            errors, 
            book: { _id: bookId, name, author, pages, price } 
        });
    }
    
    try{
        await Book.findByIdAndUpdate(req.params.id, {
            name: name,
            author: author,
            pages:pages,
            price:price,
            updatedAt: Date.now()
            }); 
            
        res.redirect(`/blogs/${req.params.id}`);
    }catch(err){
        console.log(err)
    }
}

export async function destroy(req, res){
    const id = req.params.id
     try {
        await Book.deleteOne( { _id: id } );
        return res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}  
export async function borrow(req, res){
    const book_id = req.params.id
    const user_id = req.user.userId

     try {
        const book = await Book.findById(book_id);
        if(!book){
          return res.json({msg: "book not found"})
        }
        if(!book.is_available){
           return res.json({msg: "book not available"})
        }
        const activeTransaction = await Transaction.findOne({
            book_id: book_id,
            returned_at: null
        });

        if (activeTransaction) {
            return res.status(400).json({ msg: "Book is already checked out" });
        }
        await Transaction.create({
            user_id: user_id,
            book_id: book_id,
            borrowed_at: new Date(),
            returned_at: null
        });

        // 5. Update book availability
        book.is_available = false;
        await book.save();

        return res.redirect(`/books/${book_id}`);
    } catch (error) {
        console.log(error);
    }
}  
export async function returnBook(req, res) {
    const book_id = req.params.id;
    const user_id = req.user.userId; // From the authCheck middleware
    let errorMsg = ""
    try {
        // 1. Find the active transaction belonging *specifically* to this user for this book
        const transaction = await Transaction.findOne({
            book_id: book_id,
            user_id: user_id,
            returned_at: null
        });

        // 2. If no record matches, either they didn't borrow it or it's already returned
        if (!transaction) {
            // return res.status(403).json({ 
            //     msg: "Action denied: You did not borrow this book or it has already been returned." 
            // });
            errorMsg = "You did not borrow this book or it has already been returned."
            return res.render('error', {errorMsg})
        }

        // 3. Update the transaction with the return timestamp
        transaction.returned_at = new Date();
        await transaction.save();

        // 4. Flip the book's availability back to true
        const book = await Book.findById(book_id);
        if (book) {
            book.is_available = true;
            await book.save();
        }

        return res.redirect('/books'); // Or send a success response
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error during return process" });
    }
}
// async function insertBookData() {
//   try {
//     await Book.insertMany([
//       {
//         name: "The Pragmatic Programmer",
//         author: "Andrew Hunt",
//         price: 45.99,
//         pages: 352
//       },
//       {
//         name: "Clean Code",
//         author: "Robert C. Martin",
//         price: 39.99,
//         pages: 464
//       },
//       {
//         name: "Node.js Design Patterns",
//         author: "Mario Casciaro",
//         price: 49.99,
//         pages: 588
//       },
//       {
//         name: "Eloquent JavaScript",
//         author: "Marijn Haverbeke",
//         price: 32.50,
//         pages: 472
//       },
//       {
//         name: "You Don't Know JS Yet",
//         author: "Kyle Simpson",
//         price: 29.99,
//         pages: 278
//       }
//     ]);
//     console.log("Mock books successfully inserted.");
//   } catch (error) {
//     console.log("Error inserting books:", error);
//   }
// }

// insertBookData();