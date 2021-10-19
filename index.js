let database, current_index = 0, total = 0, attached_listener = false;

const fetch_database = async (filter_value) => {
    fetch('https://mock-data-api.firebaseio.com/webb21/products.json')
    .then(res => res.json())
    .then(data => {
        database = data;
        if(filter_value != undefined) database = database.filter(el => el.rating >= filter_value);
    })
    .then(() => render(current_index));
}

const render = (index) => {
    if(current_index < 0)current_index = 0;
    else if(current_index > database.length-1) current_index = database.length-1;
    else {
        Object.keys(database[index]).forEach(key => key != 'images' ? render_to_element(key, database[index][key]) : render_image(database[index][key][0]));
    }  
}

const render_image = (data) => {
    let image = document.getElementById('image');
    image.src = data.src.medium;
    image.alt = data.alt;
    if(!attached_listener){
        image.addEventListener('click', () => purchase(current_index))
        attached_listener = true;
    }
};
const render_to_element = (id, text) => document.getElementById(id).innerText = id[0].toUpperCase() + id.slice(1) +': ' + text;
    
const render_cart_item = (object) => {
    const parent = document.getElementById('cart-div');
    const div = document.createElement('div');
    const img = document.createElement('IMG');
    const p = document.createElement('p');
    const text = document.createTextNode(object.price + 'kr');
    p.appendChild(text);
    img.src = object.images[0].src.medium;
    img.style.height = '50px';
    img.style.padding = '10px';
    
    div.appendChild(img);
    div.appendChild(p);
    div.style.display = 'flex';
    parent.appendChild(div);
}

const next = () => {
    render(++current_index)
}
const previous = () => {
    render(--current_index)
}

const timer = ms => new Promise(res => setTimeout(res, ms));

const purchase = async (index) => {
    const total_output = document.getElementById('total-output');
    const max_font_size = 40, min_font_size = 14;
    
    total += database[index].price;
    total_output.innerText = total;

    for (let i = max_font_size; i > min_font_size; i--) {
        total_output.style.fontSize = `${i}px`;
        await timer(10);
    }
      render_cart_item(database[index]);
}

const filter = async (filter_value) => {
    await fetch_database(filter_value);
    render(0);
    previous();
}