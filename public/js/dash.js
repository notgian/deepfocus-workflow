document.addEventListener("DOMContentLoaded", async (e) => {
    const briefText = document.querySelector('.brief-text')

    if (briefText.getAttribute("data-generated") == "yes")
        return;

    const res = await fetch('/brief', {
        method: 'POST'
    });

    const resJson = await res.json();

    console.log(resJson)

    if (res.status == 200)
        briefText.innerText = resJson.data;
})
