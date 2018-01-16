const path = require('path');
let Jasmine = require('jasmine');
let glob = require('glob');

ja = new Jasmine();


var HtmlReporter = require('jasmine-pretty-html-reporter').Reporter;


ja.clearReporters(); // remove default reporter logs
ja.addReporter(new HtmlReporter({ // add jasmine-spec-reporter
    path: path.resolve(__dirname, '../report')
}));

glob(path.resolve(__dirname,"./case/**/*.js"),(err,files)=>{
    console.log(files);
    ja.execute(files);
});

