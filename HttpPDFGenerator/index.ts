import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import * as puppeteer from 'puppeteer';

const htmlToPdf: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('TypeScript HTTP trigger function processed a request.');

    // Get the HTML content from the request body
    const htmlContent = req.body;

    if (htmlContent) {
        try {
            // Launch a new browser instance
            const browser = await puppeteer.launch({ headless: 'new' });
            console.log('after browser launch')

            // Create a new page
            const page = await browser.newPage();
            console.log('after new page')

            // Set the HTML content of the page
            await page.setContent(htmlContent);
            console.log('after set content')

            // Generate the PDF
            const pdfBuffer = await page.pdf({ format: 'A4' });
            console.log('after pdf')

            // Close the browser
            await browser.close();
            console.log('after browser close')

            // Set the response headers and body
            context.res = {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=output.pdf'
                },
                body: pdfBuffer
            };
        } catch (error) {
            context.res = {
                status: 500,
                body: `An error occurred while generating the PDF. ${error}`
            };
        }
    } else {
        context.res = {
            status: 400,
            body: 'Please provide HTML content in the request body.'
        };
    }
};

export default htmlToPdf;
