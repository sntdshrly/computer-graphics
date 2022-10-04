function gbr_titik(imageDataTemp, x, y, r, g, b) {
    // garis x sama y dibulatkan
    var index = 4 * (Math.ceil(x) + (Math.ceil(y) * canvasKita.width));
    imageDataTemp.data[index] = r;
    imageDataTemp.data[index + 1] = g;
    imageDataTemp.data[index + 2] = b;
    imageDataTemp.data[index + 3] = 255;
}

function gbr_titik_arr(datanya, posisi, warna) {
    let { x, y } = posisi;
    let { r, g, b } = warna;
    let index = 4 * (Math.ceil(x) + (Math.ceil(y) * canvasKita.width));
    datanya.data[index] = r;
    datanya.data[index + 1] = g;
    datanya.data[index + 2] = b
    datanya.data[index + 3] = 255;
}

function gbr_garis(imageDataSaya, x1, y1, x2, y2, r, g, b) {
    var dx = x2 - x1;
    var dy = y2 - y1;
    // gambar garis jalan di x
    if (Math.abs(dx) > Math.abs(dy)) {
        // ke kanan   
        if (x2 > x1) {
            var y = y1;
            for (var x = x1; x < x2; x++) {
                y = y + dy / Math.abs(dx); //1/m
                gbr_titik(imageDataSaya, x, y, r, g, b)
            }
        }
        else {
            // ke kiri
            var y = y1;
            for (var x = x1; x > x2; x--) {
                y = y + dy / Math.abs(dx); //1/m
                gbr_titik(imageDataSaya, x, y, r, g, b)
            }
        }
    }
    // jalan di y
    else {
        if (y2 > y1) {
            // ke atas   
            var x = x1;
            for (var y = y1; y < y2; y++) {
                x = x + dx / Math.abs(dy); //m
                gbr_titik(imageDataSaya, x, y, r, g, b)
            }
        }
        else {
            // ke bawah
            var x = x1;
            for (var y = y1; y > y2; y--) {
                x = x + dx / Math.abs(dy); //m
                gbr_titik(imageDataSaya, x, y, r, g, b)
            }
        }
    }
}

function polygon(imageDataSaya, titik, warna) {
    r = warna[0];
    g = warna[1];
    b = warna[2];
    for (i = 0; i < titik.length - 1; i++) {
        x1 = titik[i].x;
        y1 = titik[i].y;
        x2 = titik[i + 1].x;
        y2 = titik[i + 1].y;
        gbr_garis(imageDataSaya, x1, y1, x2, y2, r, g, b);
    }
    gbr_garis(imageDataSaya, titik[titik.length - 1].x, titik[titik.length - 1].y, titik[0].x, titik[0].y, r, g, b);
}

function boundaryFill(datanya, posisi, batas, warna){
    // kalau titik yg di posisi bisa diwarna, maka warnai dulu
    const warna_titik_skrg = get_warna(datanya, posisi);
    if(warna_titik_skrg.r != batas.r) {
        // warnai
        gbr_titik_arr(datanya,posisi,warna);
        boundaryFill(datanya, {x:posisi.x+1,y:posisi.y}, batas, warna);
        boundaryFill(datanya, {x:posisi.x,y:posisi.y+1}, batas, warna);
        boundaryFill(datanya, {x:posisi.x-1,y:posisi.y}, batas, warna);
        // boundaryFill(datanya, {x:posisi.x,y:posisi.y-1}, batas, warna);
    }
}

function boundaryFillStack(datanya, posisi, batas, warna){
    // kalau titik yg di posisi bisa diwarna, maka warnai dulu
    let warna_titik_skrg = get_warna(datanya, posisi);
    let my_stack = [];
    my_stack.push(posisi);
    console.log(!cekWarna(warna_titik_skrg,batas));
    while(my_stack.length>0){
        posisi = my_stack.pop();
        warna_titik_skrg = get_warna(datanya, posisi);
        console.log(warna_titik_skrg);
        if(!cekWarna(warna_titik_skrg, batas)) {
            gbr_titik_arr(datanya,posisi,warna);
            if(!cekWarna(get_warna(datanya,{x:x+1,y:y}),warna)){
                console.log("tes");
                my_stack.push({x:posisi.x+1,y:posisi.y});
            }
        }
    }
}

function cekWarna(color1, color2){
    if(color1.r == color2.r && color1.g == color2.g && color1.b == color2.b){
        return true
    }
    else{
        return false
    }
}

function get_warna(datanya,posisi){
    let { x, y } = posisi;
    let index = (x+y*canvasKita.width)*4;
    let r,g,b;
    r=datanya.data[index];
    g=datanya.data[index+1];
    b=datanya.data[index+2];
    return {r:r,g:g,b:b};
};