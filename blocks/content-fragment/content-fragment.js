function getMetadata(name) {
    const attr = name && name.includes(':') ? 'property' : 'name';
    const meta = [...document.querySelectorAll(`meta[${attr}="${name}"]`)]
      .map((m) => m.content)
      .join(', ');
    return meta || '';
  }
  
  //const aem = "http://localhost:4503";
  const aem = "https://author-p46152-e633525.adobeaemcloud.com";
  
  export default function decorate(block) {
  
    const slugID = document.createElement('div');
    slugID.id = 'slug';
    slugID.textContent = block.querySelector('div:nth-child(1)').textContent.trim();
    block.querySelector('div:nth-child(1)').replaceWith(slugID);
  
    const destinationDiv = document.createElement('div');
    destinationDiv.id = `destination-${slugID.textContent}`;
    block.querySelector('div:last-of-type').replaceWith(destinationDiv);
  
    fetch(`${aem}/graphql/execute.json/aem-demo-assets/adventure-by-slug;slug=${slugID.textContent}`)
      .then(response => response.json())
      .then(response => {
        const { primaryImage, title, description } = response.data.adventureList.items[0];
        const imageURL = `${aem}${primaryImage._path}`;
  
        destinationDiv.innerHTML = `
          <div class='destination-image'>
            <img src="${imageURL}" alt="${title}">
          </div>
          <div class='destination-content'>
            <div class='destination-content-title'><h3>${title}</h3></div>
            <div class='destination-content-title'>Sub title and again</div>
            <div class='destination-content-description'><p>${description.plaintext}</p></div>
            <div class='destination-content-description'><p>${description.html}</p></div>
          </div>
        `;
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  
  }