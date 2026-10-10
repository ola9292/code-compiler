


    const form = document.getElementById('uploadForm');
    const downloadForm = document.getElementById('downloadForm');
    const displayDownloadLoading = document.getElementById('displayDownloadLoading');
    const displayDownloadUrl = document.getElementById('displayDownloadUrl');
    const displayDownloadMessage = document.getElementById('displayDownloadMessage')

    if(form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                sendData(formData);
            });
        }

    if (downloadForm) {
        downloadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(downloadForm);
            sendPassword(formData);
        });
    }

async function sendData(formData) {
        displayDownloadLoading.textContent = "uploading..."
        const url = "/upload";
        try {
            const response = await fetch(url, {
                method: "POST",
                body:formData
            });
           
            const result = await response.json();
             if (!response.ok) {
                displayDownloadLoading.textContent = result.msg
                displayDownloadLoading.style.color = "red"
                throw new Error(`Response status: ${response.status}`);
            }
            console.log(result);
            displayDownloadLoading.textContent = ""
            displayDownloadUrl.href = result.data
            displayDownloadUrl.textContent = result.data
        } catch (error) {
            console.error(error.message);
        }
    }


async function sendPassword(formData) {
        displayDownloadMessage.textContent = ""
        const url = "/download";
        try {
            const response = await fetch(url, {
                method: "POST",
                body:formData
            });
            if (!response.ok) {
                const result = await response.json();
                displayDownloadMessage.textContent = result.msg 
                displayDownloadMessage.style.color = "red"
                throw new Error(`Response status: ${response.status}`);
            }
            // success response is the actual file bytes
            const blob = await response.blob();
            
            // pull the filename out of Content-Disposition, set by res.download()
            const disposition = response.headers.get('Content-Disposition');
            const match = disposition && disposition.match(/filename="([^"]+)"/);
            const filename = match ? match[1] : 'download';

            // trigger a real browser download
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error(error.message);
        }
    }