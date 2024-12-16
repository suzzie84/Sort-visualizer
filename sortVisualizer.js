let array = [];
let speed = 100;

function generateBars() {
    const input = document.getElementById('arrayInput').value;
    const arrayInput = input.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
    if (arrayInput.length > 0) {
        array = arrayInput;
        drawBars();
    } else {
        alert('Please enter a valid array');
    }
}

function drawBars() {
    const container = document.getElementById('arrayContainer');
    container.innerHTML = ''; 
    const maxValue = Math.max(...array);
    array.forEach((value) => {
        const bar = document.createElement('div');
        let height = (value / maxValue) * 500; 
        height = Math.max(height, 50);
        bar.style.height = height + 'px';
        bar.classList.add('bar');

        const valueLabel = document.createElement('span');
        valueLabel.textContent = value;
        valueLabel.classList.add('bar-value');
        bar.appendChild(valueLabel);

        container.appendChild(bar);
    });
}

document.getElementById('speed').addEventListener('input', (e) => {
    speed = e.target.value;
});

function startSorting() {
    const algorithm = document.getElementById('algorithmSelect').value;
    switch (algorithm) {
        case 'bubble':
            bubbleSort();
            break;
        case 'insertion':
            insertionSort();
            break;
        case 'selection':
            selectionSort();
            break;
        case 'quick':
            quickSort(array, 0, array.length - 1);
            break;
        case 'merge':
            mergeSort(array, 0, array.length - 1);
            break;
    }
}

async function bubbleSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                await visualizeSorting(arr, j, j + 1);
            }
        }
    }
}

async function insertionSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
            await visualizeSorting(arr, i, j );
        }
        arr[j + 1] = key;
        await visualizeSorting(arr, i, j + 1);
    }
}

async function selectionSort() {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        await visualizeSorting(arr, i, minIdx);
    }
}

async function quickSort(arr, low, high) {
    if (low < high) {
        let pi = await partition(arr, low, high);
        await quickSort(arr, low, pi - 1);
        await quickSort(arr, pi + 1, high);
    }
}

async function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            await visualizeSorting(arr, i, j);
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    await visualizeSorting(arr, i + 1, high);
    return i + 1;
}

async function mergeSort(arr, left, right) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);
        await mergeSort(arr, left, middle);
        await mergeSort(arr, middle + 1, right);
        await merge(arr, left, middle, right);
    }
}

async function merge(arr, left, middle, right) {
    let n1 = middle - left + 1;
    let n2 = right - middle;
    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[left + i];
    for (let j = 0; j < n2; j++) R[j] = arr[middle + 1 + j];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
        await visualizeSorting(arr, left, right);
    }

    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        await visualizeSorting(arr, left, right);
    }

    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        await visualizeSorting(arr, left, right);
    }
}

async function visualizeSorting(arr, i, j) {
    array = arr;
    drawBars();
    await new Promise(resolve => setTimeout(resolve, speed));
}
