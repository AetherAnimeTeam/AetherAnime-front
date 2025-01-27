import React from 'react';
import "./NotFound.css"

const NotFound = () => {
    return (
        <div className="NotFound">
            <img src={require("../../assets/images/404.png") || ''} alt="aa"/>

            <h1>Упс, такой страницы не существует</h1>
            <div dangerouslySetInnerHTML={{__html: '<!--  512 bytes of padding to suppress Internet Explorer\'s "Friendly error messages"\n' +
                    '\n' +
                    '                From: HOW TO: Turn Off the Internet Explorer 5.x and 6.x "Show Friendly HTTP Error Messages" Feature on the Server Side\n' +
                    '                      http://support.microsoft.com/kb/294807\n' +
                    '\n' +
                    '                Several frequently-seen status codes have "friendly" error messages\n' +
                    '                that Internet Explorer 5.x displays and that effectively mask the\n' +
                    '                actual text message that the server sends.\n' +
                    '                However, these \\"friendly\\" error messages are only displayed if the\n' +
                    '                response that is sent to the client is less than or equal to a\n' +
                    '                specified threshold.\n' +
                    '                For example, to see the exact text of an HTTP 500 response,\n' +
                    '                the content length must be greater than 512 bytes. -->'}}/>

        </div>
    );
};

export default NotFound;