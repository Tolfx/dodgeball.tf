import HeaderTemplate from "./Header.template";

export default function SuccessTemplate(message?: string)
{
    return `
  <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: sans-serif;
                    background-color: #1A1D20;
                    color: #F1FFFF;
                }
                code {
                    background-color: #fafafa;
                    padding: 5px;
                    border-radius: 5px;
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #000;
                }
            </style>
        </head>
        <body>
            <div>
                ${HeaderTemplate()}
                <div style="text-align:center;">
                    ${message ? `<h1>${message}</h1>` : `<h1>Success!</h1>`}
                </div>
            </div>
        </body>
    </html>`
}