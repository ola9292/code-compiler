# ⚙️ Code Compiler API (Node.js + Express)

A REST API that accepts source code in JavaScript, PHP or Python, executes it on the server, and returns the program output or the language's own error message.

---

## Features

- Run JavaScript, PHP and Python code through a single endpoint
- Each submission is saved as a temporary file with a unique UUID name
- Returns program output (`stdout`) on success
- Returns the language's real error message on failure (syntax errors, runtime errors, etc.)
- Server file paths and Node.js internal stack frames are stripped from error messages
- 5 second execution timeout to stop infinite loops
- Output size limit on JavaScript runs to prevent memory exhaustion
- Temporary files are always deleted after execution, even when the code fails

---

## Tech Stack

- Node.js
- Express.js
- `child_process.exec` for running code
- `uuid` for unique file names

---

## How It Works

1. The client sends `language` and `code` to the API.
2. The server writes the code to a temporary file in the `codes/` folder.
3. The matching runtime (`node`, `php` or `python3`) executes the file.
4. The output or the cleaned error is returned as JSON.
5. The temporary file is deleted.

---

## API Endpoint

### `POST /api/run`

**Request body**

```json
{
  "language": "js",
  "code": "console.log('Hello world');"
}
```

| Field      | Type   | Description                                          |
| ---------- | ------ | ---------------------------------------------------- |
| `language` | string | `js`, `php` or `py` (any other value runs as Python) |
| `code`     | string | The source code to execute                           |

---

## Responses

**200 OK** - code ran successfully

```json
{
  "data": "Hello world\n"
}
```

**400 Bad Request** - the submitted code failed to run (syntax or runtime error)

```json
{
  "error": "main:5\necho \"gello\";\n     ^^^^^^^\n\nSyntaxError: Unexpected string"
}
```

**400 Bad Request** - missing `language` or `code`

```json
{
  "message": "enter code and language"
}
```

**500 Internal Server Error** - a real server failure (for example, the file could not be written)

```json
{
  "error": "Internal server error"
}
```

---

## Error Handling

The API returns the error produced by the language runtime itself, because it is the most accurate message available. Before sending it, the server:

- Replaces the temporary file path (and `file://` prefix) with `main`, so no server paths are exposed
- Removes Node.js internal stack frames, leaving the error type, message and line number

Errors from the user's code return `400`. Genuine server failures return `500`.

---

## Installation

```bash
git clone <your-repo-url>
cd code-compiler-api
npm install
npm start
```

The server runs on `http://localhost:5001`.

**Requirements:** Node.js, PHP and Python 3 must be installed on the machine running the API.

---

## Example Request

```bash
curl -X POST http://localhost:5001/api/run \
  -H "Content-Type: application/json" \
  -d '{"language": "py", "code": "print(\"Hello\")"}'
```

---

## Known Limitations

- Code is **not sandboxed**. It runs directly on the host machine, so this API should only be used locally or behind a sandbox such as Docker before being exposed publicly.
- No support for programs that need user input (`stdin`).
- Only JavaScript, PHP and Python are supported.

---

## Future Improvements

- Run each job inside a Docker container
- Add rate limiting
- Support `stdin` input
- Add more languages
# code-compiler
