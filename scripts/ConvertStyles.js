const fs = require('fs');
const sass = require('sass');


const inputFile = './styles/SASSstyles/styles.scss';
const outputFile = './styles/CSSstyles/styles.css';

const result = sass.renderSync({
  file: inputFile,
});

fs.writeFileSync(outputFile, result.css.toString());


