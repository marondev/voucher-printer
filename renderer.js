const escpos = require('escpos');
const fs = require('fs');

const printCode = function( codes = [] ) {

    const usbDevice = new escpos.USB();
    const usbPrinter = new escpos.Printer(usbDevice);
    
    usbDevice.open(() => {
        codes.forEach( code => {

            var title = '';
            var row = code
                .trim()
                .replace(/\s/g, '\t')
                .split('\t');
            

            if ( row[2] ) {
                title = `Time: ${row[0]}     Price: ${row[2]}`;
                code = row[1];
            } else if( row[1] ) {
                title = `Time: ${row[0]}`;
                code = row[1];
            }

            usbPrinter
                .font('A')
                .align('ct')
                .style('bu')
                .size(1,1)
                .text('------------------------------\n')
                .size(2,2)
                .text(code + '\n');
            
            if ( title ) {
                usbPrinter
                    .size(1,1)
                    .text(title);
            }
           
        });

        usbPrinter.cut();
        usbPrinter.close();
    });
}

Dropzone.options.voucher = {
    init: function() {
        this.on("addedfile", function(file) {
            try {
                var data = fs.readFileSync(file.path, 'utf8');
                var codes = data.split('\n');
                printCode( codes );

            } catch(e) {
                console.log('Error:', e.stack);
            }
        });
    },
};