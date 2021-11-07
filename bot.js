// check if puppeteer downloaded
const puppeteer = require('puppeteer');

const product_url = "https://www.walmart.com/ip/Mainstays-Side-Storage-Desk-White/973415775";


async function givePage(){
    // headless:true - when program is run, browser window won't pop up
    // headless:false - see window, best to use when checking is program works
    const browser = await puppeteer.launch({headless: false}); 
    const page = await browser.newPage();
    await page.goto(product_url);
    return page;
}

async function addToCart(page){
    await page.goto(product_url);
    
    // makes sure button class is rendered in html so no errors occur- if page is still loading
    await page.waitForSelector("button[class='button spin-button prod-ProductCTA--primary button--primary']");
    // click element, class id of add to cart button
    await page.click("button[class='button spin-button prod-ProductCTA--primary button--primary']", elem => elem.click());
    
    // click checkout box
    await page.waitForNavigation(); // waits for page to load
    // await page.waitForSelector("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']");
    await page.click("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']", elem => elem.click());

    // continue as guest
    // no class id, data-automation-id
    await page.waitForNavigation();
    await page.click("button[data-automation-id='new-guest-continue-button']", elem => elem.click());

    // continue
    await page.waitForNavigation();
    await page.waitFor(1000); // 1 sec delay to be safe
    await page.click("button[data-automation-id='fulfillment-continue']", elem => elem.click());
}

// ensures that all buttons are clicked
// previous method encounters errors bc of computer speed, rendering, etc. 
// ensures it gets to billing page 
async function addToCart2(page){
    await page.goto(product_url);
    await page.waitForSelector("button[class='button spin-button prod-ProductCTA--primary button--primary']");
    await page.click("button[class='button spin-button prod-ProductCTA--primary button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.click("button[class='button ios-primary-btn-touch-fix hide-content-max-m checkoutBtn button--primary']", elem => elem.click());
    await page.waitForNavigation();
    await page.waitFor(2000);
    // evaluate can work better than .click bc injects js into computer
    // page evaluates js method, input class name returns array/list of all elements w class name
    await page.evaluate(() => document.getElementsByClassName('button m-margin-top width-full button--primary')[0].click());
    await page.waitForNavigation();
    await page.waitFor(1000);
    await page.evaluate(() => document.getElementsByClassName('button cxo-continue-btn button--primary')[0].click());
}

async function fillBilling(page){
    await page.waitFor(1000);
    await page.type("input[id='firstName']", 'Saima');
    await page.waitFor(100);
    await page.type("input[id='lastName']", 'Ahmed');
    await page.waitFor(100);
    await page.type("input[id='addressLineOne']", '8204 Baltimore Avenue');
    await page.waitFor(100);
    await page.type('#phone', '4435216729');
    await page.waitFor(100);
    await page.type('#email', 'saima.ahmed.2528@gmail.com');
    await page.waitFor(200);
    await page.$eval("button[class='button button--primary']", elem => elem.click());

    /*
    website lag- try and catch alerts 
    catch alert- refresh and repeat all functions

    <span alerttype="warning" message="We're having trouble with your request. 
    Please wait a moment and then try again." steps="fulfillment" class="alert-style-override message 
    active message-warning message-block message-above-form" role="alert">We're having trouble with your request. 
    Please wait a moment and then try again.</span>
    */
}

/* if invalid address is entered pop up message asks to edit address or continue
async function verifyAddress(page){
    await page.waitFor(1000);
    await page.$eval("button[class='button-wrapper']", elem => elem.click());
}
*/

async function payment(page){
    await page.waitFor(1000);
    await page.type('#creditCard', '4539091988611068');
    await page.waitFor(100);
    // drop down menu, scroll and select item
    // not running for some reason idk 
    await page.select('#month-chooser', '02');
    await page.waitFor(100);
    await page.select('#year-chooser', '2024');
    await page.waitFor(100);
    await page.type('#cvv', '221');
    await page.click("button[class='button spin-button button--primary']", elem => elem.click());

}

async function submit(page){
    await page.waitFor(100);
    await page.waitFor(100);
    await page.click("button[class='button button--primary']", elem => elem.click());
}

// create first page
async function checkout(){
    var page = await givePage();
    await addToCart2(page);
    await fillBilling(page);
    await payment(page);
    await submit(page);
}


checkout();