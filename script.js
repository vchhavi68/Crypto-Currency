
const table_body = document.querySelectorAll("#hero>table")[0];
const sortPercentage = document.getElementById("sortByPercentage");
const sortMktcap = document.getElementById("sortByCap");
const search_btn = document.getElementById("search");
let data;

function createrow(data) {
    table_body.innerHTML = ``;
    for (let el of data) {
        const tr = document.createElement("tr");
        console.log(el.market_cap_change_percentage_24h.toString().includes("-"));
        if (!el.market_cap_change_percentage_24h.toString().includes("-")) {
            tr.innerHTML = `
                <td class="row1"><img src=${el.image} alt=${el.name}>${el.name}</td>
                <td class="row2">${el.symbol.toUpperCase()}</td>
                <td class="common-row">$${el.current_price}</td>
                <td class="common-row">$${el.total_volume}</td>
                <td class="common-row positive-change">${el.market_cap_change_percentage_24h}%</td>
                <td class="common-row last-row">Mkt Cap : $${el.market_cap}</td>
                `;
        }
        else {
            tr.innerHTML = `
                <td class="row1"><img src=${el.image} alt=${el.name}>${el.name}</td>
                <td class="row2">${el.symbol.toUpperCase()}</td>
                <td class="common-row">$${el.current_price}</td>
                <td class="common-row">$${el.total_volume}</td>
                <td class="common-row negative-change">${el.market_cap_change_percentage_24h}%</td>
                <td class="common-row last-row">Mkt Cap : $${el.market_cap}</td>
                `;
        }
        table_body.appendChild(tr);
    }
}

async function generateOutput() {
    try {
        const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
        data = await response.json();
        createrow(data);
    } catch (error) {
        console.log(error);
    }
}
sortPercentage.addEventListener("click", () => {
    let new_data = data.sort((a, b) => {
        return a.market_cap_change_percentage_24h - b.market_cap_change_percentage_24h;
    })
    createrow(new_data);
})
sortMktcap.addEventListener("click", () => {
    let new_data = data.sort((a, b) => {
        return a.market_cap - b.market_cap;
    })
    createrow(new_data);
})
function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    }
}
function searchfn(event) {
    console.log(event.target.value);
    let new_data = data;
    try {
        new_data = data.filter((el) => {
            return el.id.includes(event.target.value) || el.name.includes(event.target.value);
        });
    } catch (error) {
        console.log(error);
    }
    createrow(new_data);
}
const searchStart = debounce((event) => {
    searchfn(event);
})
search_btn.addEventListener("keyup", searchStart);
generateOutput();