const links = [
  { "name": "CloudFlare", "url": "https://www.cloudflare.com/" },
  { "name": "Google", "url": "https://google.com" },
  { "name": "YouTube", "url": "https://youtube.com" }
]
const targetURL = "https://static-links-page.signalnerve.workers.dev"
const dogURL = "https://glorialovepets.com/wp-content/uploads/2020/06/frc-ffa07e85c869ba8527ded93712083b7b.jpeg"

class LinksAdder {
  constructor(inputLinks) {
    this.inputLinks = inputLinks
  }
  element(element) {
    for(const e of this.inputLinks){
      element.append(`<a href=${e.url}>${e.name}</a>`, {html: true})
    }
  }
}


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {
  const url = new URL(request.url)
  if( url.pathname === "/links"){
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json' },
    })
  }
  const init = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  const rewriter = new HTMLRewriter()
    .on('div#links', new LinksAdder(links))
    .on('div#profile', {element: e=>e.removeAttribute("style")})
    .on('img#avatar', {element: e=>e.setAttribute("src", dogURL)})
    .on('h1#name', {element: e=>e.setInnerContent("Aaron")})
  const result = await rewriter.transform(await fetch(targetURL, init)).text()
  return new Response(result, {
    headers: { 'content-type': "text/html" }
  })
  
}
