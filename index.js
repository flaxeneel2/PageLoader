const puppeteer = require("puppeteer")
const figlet = require("figlet")
const chalk = require("chalk")
var argv = []
var browser;
var page;
var interval;
var isLoaded = false;
async function run () {
    for(let arg of process.argv) {
        argv.push((process.argv[process.argv.indexOf(arg)]).toLowerCase())
    }
    if(argv.includes("--help")) {
        console.log(chalk.yellowBright(figlet.textSync("Page Loader")))
        console.log(chalk.yellowBright("Switches: "))
        console.log(chalk.blue("-f") + ": " + chalk.green("Frequency the page is reloaded at") + " " + chalk.gray("(Default: 10 seconds)"))
        console.log(chalk.blue("--url") + ": " + chalk.green("url to visit"))
        console.log(chalk.blue("--http") + ": " + chalk.green("if http/https is not given in the url, this will make it use http instead of the default https"))
        console.log(chalk.blue("--help") + ": " + chalk.green("Shows this help page"))
        process.exit()
    }
    interval = await getInterval()
    let url = await getURL()
    console.log(url)
    browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    page = await browser.newPage();
    try {
    await page.goto(url);
    } catch(error) {
        console.log(chalk.bgRedBright(error))
        process.exit()
    }
    isLoaded = true;
    await loadRepeater()
}

async function getURL() {
    if(!argv.includes(("--url"))) { console.log(chalk.bgRedBright("URL Not Specified!")); process.exit() }
    else {
        let link = (argv[argv.indexOf(("--url")) + 1]).toLowerCase()
        if(!link) { console.log(chalk.bgRedBright("URL Not Specified")); process.exit() }
        return link.includes("https://") || link.includes("http://") ? link : ((argv.includes("--http") ? "http://" : "https://") + link)
    }
}

async function getInterval() {
    var val = 10000
    if(argv.includes("-f") && argv[argv.indexOf("-f") + 1]) val = (parseInt(argv[argv.indexOf("-f") + 1]))*1000
    return val;
}

async function loadRepeater() {
    setInterval(() => {
        if(!isLoaded) return;
        page.reload()
        console.log(chalk.greenBright("reloaded!"))
    }, interval)
}

run();

