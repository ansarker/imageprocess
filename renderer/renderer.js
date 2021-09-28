let { PythonShell } = require('python-shell');


// // Select a directory and stitch the images in that directory
let imagePath = document.getElementById('imagePath');
let numIndex = document.getElementById('numIndex');
let addRows = document.getElementById('addRows');
let numRows = document.getElementById('numRows');
let rgb = ['r', 'g', 'b']
let count = 0;
let input_dir = '';


imagePath.addEventListener('change', (event) => {
    let files = event.target.files;
    
    const file_path = files[0].path;
    const name_len = files[0].name.length;
    input_dir = file_path.substring(0, file_path.length - name_len);

    document.getElementById('selectedOrgDir').style = 'color: #155724; \
    background-color: #d4edda; border-color: #c3e6cb;';
    document.getElementById('selectedOrgDir').value = input_dir;

}, false)

numIndex.addEventListener('click', (event) => {
    count++;
    numRows.innerText = count;

    let new_rows = document.createElement("tr");
    let td_in = "";
    td_in += "<td><input class='tb_inp' value='' id='ind_" + count + "' type='number' /></td>";
    for (let j = 1; j < 4; j++) {
        td_in += "<td><input class='tb_inp' value='0' id='" + rgb[j-1] + "_" + count + "'  type='number' oninput='getColor()' /></td>"
    }
    td_in += "<td><div class='color-js' id='color-js_" + count + "'></div></td>"
    td_in += "<td><button class='remove_btn' onclick='deleteRow(this)'>Remove</button></td>";

    new_rows.innerHTML = td_in;
    addRows.appendChild(new_rows);
}, false)

// Delete row
function deleteRow(r) {
    if(count > 0) {
        count--;
        var i = r.parentNode.parentNode.rowIndex;
        document.getElementById("myTable").deleteRow(i);
    }
    numRows.innerText = count;
}       

// Colors
function getColor() {
    for(let i = 0; i < numRows.innerText + 1; i++) {
        let r;
        let g;
        let b;

        let in_r = document.getElementById("r_" + i);
        let in_g = document.getElementById("g_" + i);
        let in_b = document.getElementById("b_" + i);

        if(in_r != null || in_g != null || in_b != null) {
            r = in_r.value; g = in_g.value; b = in_b.value;
            document.getElementById('color-js_' + i).style= 'background: rgb(' + r + ',' + g + ',' + b + ')';
        }
    }
}

document.getElementById('run').addEventListener('click', () => {
    let num_classes = numRows.innerText;
    let index_values = [];
    let label_colors = '';
    
    for(let i = 0; i < numRows.innerText; i++) {
        let ind = document.getElementById("ind_" + (i+1));
        let r = document.getElementById("r_" + (i+1));
        let g = document.getElementById("g_" + (i+1));
        let b = document.getElementById("b_" + (i+1));
        
        index_values.push({
            ind: ind.value,
            color_map: [parseInt(r.value), parseInt(g.value), parseInt(b.value)]
        })
    }
    
    for(let j = 0; j < index_values.length; j++) {
        for(let k = 0; k < 3; k++) {
            label_colors += index_values[j].color_map[k] + ",";
            // console.log(index_values[j].color_map[k])
        }
    }
    label_colors = label_colors.substr(0, label_colors.length - 1);
    console.log(label_colors)

    // const saving_path = '/media/anis/Data/DeskSoft/index-image/output';
    let options = {
        mode: 'text',
        // pythonPath: 'path/to/python',
        pythonOptions: ['-u'], // get print results in real-time
        scriptPath: '/run/media/anis/Data/DeskSoft/index-image/python',
        args: ['--image_path', input_dir, '--num_classes', num_classes, '--label_colors', label_colors]
    };

    PythonShell.run('main.py', options, function (err, result) {
        if (err) {
            document.getElementById('intheend').style = 'color: #721c24; \
                    background-color: #f8d7da; border-color: #f5c6cb;'
            document.getElementById('intheend').innerText = 'Failed!';
            throw err;
        } else {
            document.getElementById('intheend').style = 'color: #155724; \
                    background-color: #d4edda; border-color: #c3e6cb;';
            document.getElementById('intheend').innerText = 'Success!';
            // console.log(result)
        }
    })
}, true)


