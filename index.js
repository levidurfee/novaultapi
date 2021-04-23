import generate from 'novaultpw';

const options = {
    length: 16,
    characters: "YWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjEyMzQ1Njc4OTB+IUAjJCVeJipfLSs9fFxcKCl7fVtdOjsiJzw+LC4/L2A=",
};

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
    let req = await request.json();
    if(req.length && req.length > 6) {
        options.length = req.length;
    }
    if(req.characters) {
        options.characters = req.characters;
    }
    if(!req.password) {
        return handleError("password required");
    }
    if(!req.resource) {
        return handleError("resource required");
    }

    let chars = "";
    try {
        chars = atob(options.characters);
    } catch(e) {
        return handleError(e);
    }

    let pw = generate(options.length, chars, req.password, req.resource);

    return new Response(pw, {
        headers: { 'content-type': 'text/plain' },
    });
}

async function handleError(msg) {
    return new Response(JSON.stringify({
        error: msg
    }), {
        headers: { 'content-type': 'application/json' }
    });
}
