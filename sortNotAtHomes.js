// Import moment during testing on node
var moment = require('moment')

(() => {
    //Global settings
    const 
          dt = moment().format('L'),
          rgx = /^\d+/,
          rgxTask = /^\s*-\s*\[[\s]\]\s/,
          rgxTaskDone = /^\s*-\s*\[[x\-\*\+]\]/,
          optOddEven = false,
          optAsc = false,
          optTask = true,
          optShowInvisible = true;

    const main = () => {
        const data = `# Not at Homes
## ${dt}

### Smith Street
- [x] 3388 x2
- [ ] 8833 x3
- [ ] 5575 NS
- [x] 11
- [x] 88
- [ ] 900 No soliciting
- [ ] 399
- [ ] 438
- [ ] 1
- [ ] 23 Don't know 

### Alpha Ave
- [x] 338
8883 Notes...
33383
090
111 Gate
388 Letter writing
990 No soliciting, not sure`;

        let
            newTxt = '',
            d = data.split('\n\n');

        for (let v of d) {
            let va = v.split('\n');
            newTxt += va.splice(0, 1) + '\n';
            va = va.filter(s => !rgxTaskDone.test(s))
            va = va.map(Detaskify);
            va.sort(sortHouses);
            if (optTask) {
                va = va.map(s => rgx.test(s) ? Taskify(s) : s)
            }
            newTxt += va.join('\n') + '\n\n'
        }
        return optShowInvisible ? 
                 invisibles(newTxt) :
                 newTxt;
    }
    //GENERIC FUNCTIONS    
    const sortHouses = (a, b) => {
        let aNum = 0,
            bNum = 0;
        //Reverse a,b for desc sort
        if (optAsc) {
            //Math.abs (no negative house #s)
            aNum = Math.abs(rgx.exec(a));
            bNum = Math.abs(rgx.exec(b));
        } else {
            aNum = Math.abs(rgx.exec(b));
            bNum = Math.abs(rgx.exec(a));
        }

        if (optOddEven) {
            return aNum % 2 - bNum % 2 || aNum - bNum || a > b;
        } else {
            return aNum - bNum || a > b;
        };

    };

    const Taskify = s => '- [ ] ' + s;
  
    const Detaskify = s => s.replace('- [ ] ', '');
  
    const invisibles = strText => {
     return (strText.length > 0 ? (
            JSON.stringify(strText) // Visible escapes,
            .slice(1, -1)           // without flanking quotes,
            .replace(/ /g, '.')     // using . to show spaces,
            .split('\\n')           // and breaking the string
        ) : []).join('\\n\n')        // into lines with visible \n
    }
    
    //MAIN
    let output = main();
    console.log(output);
})();