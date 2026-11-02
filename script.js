// Datos Iniciales de Barrios de CABA
const defaultNeighborhoods = [
{ id: 'puerto_madero', name: 'Puerto Madero', zone: 'Corredor Norte', rent: 1500000, expensas: 350000 },
{ id: 'nunez', name: 'Núñez', zone: 'Corredor Norte', rent: 920000, expensas: 180000 },
{ id: 'palermo', name: 'Palermo', zone: 'Corredor Norte', rent: 850000, expensas: 190000 },
{ id: 'belgrano', name: 'Belgrano', zone: 'Corredor Norte', rent: 450000, expensas: 170000 },
{ id: 'colegiales', name: 'Colegiales', zone: 'Norte Residencial', rent: 850000, expensas: 160000 },
{ id: 'saavedra', name: 'Saavedra', zone: 'Norte Residencial', rent: 780000, expensas: 150000 },
{ id: 'urquiza', name: 'Villa Urquiza', zone: 'Norte Residencial', rent: 820000, expensas: 155000 },
{ id: 'devoto', name: 'Villa Devoto', zone: 'Norte Residencial', rent: 800000, expensas: 140000 },
{ id: 'recoleta', name: 'Recoleta / Barrio Norte', zone: 'Norte Residencial', rent: 850000, expensas: 200000 },
{ id: 'crespo', name: 'Villa Crespo / Chacarita', zone: 'Norte Residencial', rent: 800000, expensas: 150000 },
{ id: 'caballito', name: 'Caballito', zone: 'Eje Centro', rent: 760000, expensas: 150000 },
{ id: 'almagro', name: 'Almagro / Boedo', zone: 'Eje Centro', rent: 700000, expensas: 140000 },
{ id: 'san_telmo', name: 'San Telmo / Retiro', zone: 'Eje Centro', rent: 750000, expensas: 160000 },
{ id: 'balvanera', name: 'Balvanera / San Nicolás', zone: 'Eje Centro', rent: 760000, expensas: 145000 },
{ id: 'flores', name: 'Flores / Floresta', zone: 'Zona Sur / Oeste', rent: 690000, expensas: 130000 },
{ id: 'barracas', name: 'Barracas / Parque Patricios', zone: 'Zona Sur / Oeste', rent: 750000, expensas: 140000 },
{ id: 'monserrat', name: 'Monserrat / San Cristóbal', zone: 'Zona Sur / Oeste', rent: 680000, expensas: 135000 },
{ id: 'lugano', name: 'Lugano / Soldati', zone: 'Zona Sur / Oeste', rent: 560000, expensas: 110000 }
];

let neighborhoods = JSON.parse(JSON.stringify(defaultNeighborhoods));
let chartInstance = null;

// Inicialización de la App
document.addEventListener('DOMContentLoaded', () => {
populateNeighborhoodDropdown();
initChart();
updateAllCalculations();
});

function populateNeighborhoodDropdown() {
    const select = document.getElementById('neighborhoodSelect');
    if (!select) return;

    select.innerHTML = ''; // Limpia las opciones anteriores

    neighborhoods.forEach(n => {
        const opt = document.createElement('option');
        opt.value = n.id;
        
        // CORRECTO: Usar comillas invertidas `` (backticks)
        opt.text = `${n.name} (${n.zone})`;
        
        if (n.id === 'nunez') opt.selected = true;
        select.appendChild(opt);
    });
}

function onNeighborhoodDropdownChange() {
const id = document.getElementById('neighborhoodSelect').value;
const n = neighborhoods.find(item => item.id === id);
if (n) {
document.getElementById('rentInput').value = n.rent;
document.getElementById('rentRange').value = n.rent;
document.getElementById('expensesInput').value = n.expensas;
document.getElementById('expensesRange').value = n.expensas;
document.getElementById('hoZoneName').innerText = n.name;
updateAllCalculations();
}
}

function syncSliderFromInput(type, val) {
document.getElementById('${type}').value = val;
updateAllCalculations();
}

function syncInputFromSlider(type, val) {
document.getElementById('${type}Input').value = val;
updateAllCalculations();
}

function applyPreset(income, rent, expenses, neighborhoodId) {
document.getElementById('incomeInput').value = income;
document.getElementById('incomeRange').value = income;
document.getElementById('rentInput').value = rent;
document.getElementById('rentRange').value = rent;
document.getElementById('expensesInput').value = expenses;
document.getElementById('expensesRange').value = expenses;

if (neighborhoodId) {
    const select = document.getElementById('neighborhoodSelect');
    select.value = neighborhoodId;
    const n = neighborhoods.find(item => item.id === neighborhoodId);
    if (n) document.getElementById('hoZoneName').innerText = n.name;
}
updateAllCalculations();


}

function formatCurrency(val) {
return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(val);
}

function updateAllCalculations() {
const income = parseFloat(document.getElementById('incomeInput').value) || 0;
const rent = parseFloat(document.getElementById('rentInput').value) || 0;
const expenses = parseFloat(document.getElementById('expensesInput').value) || 0;
const services = parseFloat(document.getElementById('servicesInput').value) || 0;
const groceries = parseFloat(document.getElementById('superInput').value) || 0;
const leisure = parseFloat(document.getElementById('leisureInput').value) || 0;

const totalHousing = rent + expenses + services;
const totalLiving = groceries + leisure;
const totalSpent = totalHousing + totalLiving;
const surplus = income - totalSpent;

const housingPct = Math.round((totalHousing / income) * 100) || 0;
const livingPct = Math.round((totalLiving / income) * 100) || 0;
const savingsPct = Math.max(0, 100 - housingPct - livingPct);

// Actualizar Textos
document.getElementById('summaryIncome').innerText = `$${formatCurrency(income)} ARS`;
document.getElementById('summaryExpenses').innerText = `$${formatCurrency(totalSpent)} ARS`;

const summarySurplusEl = document.getElementById('summarySurplus');
summarySurplusEl.innerText = `$${formatCurrency(surplus)} ARS`;
if (surplus < 0) {
    summarySurplusEl.className = 'text-2xl font-black text-red-400';
} else {
    summarySurplusEl.className = 'text-2xl font-black text-emerald-400';
}

document.getElementById('housingPct').innerText = `${housingPct}%`;
document.getElementById('livingPct').innerText = `${livingPct}%`;
document.getElementById('savingsPct').innerText = `${savingsPct}%`;

document.getElementById('barHousing').style.width = `${Math.min(housingPct, 100)}%`;
document.getElementById('barLiving').style.width = `${Math.min(livingPct, 100 - housingPct)}%`;
document.getElementById('barSavings').style.width = `${savingsPct}%`;

document.getElementById('housingTotalText').innerText = formatCurrency(totalHousing);
document.getElementById('livingTotalText').innerText = formatCurrency(totalLiving);
document.getElementById('savingsTotalText').innerText = formatCurrency(surplus > 0 ? surplus : 0);

// Actualizar Diagnóstico de Viabilidad
const viabilityTitle = document.getElementById('viabilityStatusTitle');
const viabilityDesc = document.getElementById('viabilityDescription');
const ratioBadge = document.getElementById('ratioBadge');

const housingRatio = ((rent + expenses) / income) * 100;
ratioBadge.innerText = `${housingRatio.toFixed(1)}% Vivienda Fija`;

if (housingRatio <= 35) {
    viabilityTitle.className = "text-2xl font-bold text-emerald-400 flex items-center gap-2 mt-1";
    viabilityTitle.innerHTML = `<i class="fa-solid fa-circle-check"></i> Proyecto Altamente Viable & Holgado`;
    viabilityDesc.innerText = `Tus costos fijos representan sólo un ${housingRatio.toFixed(1)}% de tus ingresos. Contás con gran margen para ahorrar e imprevistos.`;
    ratioBadge.className = "px-3 py-1 text-sm font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
} else if (housingRatio <= 50) {
    viabilityTitle.className = "text-2xl font-bold text-amber-400 flex items-center gap-2 mt-1";
    viabilityTitle.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Proyecto Viable pero Ajustado`;
    viabilityDesc.innerText = `El alquiler y las expensas absorben el ${housingRatio.toFixed(1)}% de tu sueldo. Se recomienda controlar los gastos variables de ocio.`;
    ratioBadge.className = "px-3 py-1 text-sm font-bold rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30";
} else {
    viabilityTitle.className = "text-2xl font-bold text-red-400 flex items-center gap-2 mt-1";
    viabilityTitle.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> Riesgo Financiero Alto`;
    viabilityDesc.innerText = `Los gastos de vivienda superan el 50% de tu sueldo (${housingRatio.toFixed(1)}%). Considerá un barrio más accesible o evaluar monoambientes.`;
    ratioBadge.className = "px-3 py-1 text-sm font-bold rounded-full bg-red-500/20 text-red-300 border border-red-500/30";
}

// Calcular Costos de Entrada
const guaranteeType = document.getElementById('guaranteeType').value;
const guaranteeCost = guaranteeType === 'caucion' ? rent * 1.8 : rent * 0.5;
const movingCost = 200000;
const totalEntry = rent + rent + guaranteeCost + movingCost;

document.getElementById('entryFirstMonth').innerText = `$${formatCurrency(rent)}`;
document.getElementById('entryDeposit').innerText = `$${formatCurrency(rent)}`;
document.getElementById('entryGuarantee').innerText = `$${formatCurrency(guaranteeCost)}`;
document.getElementById('entryMoving').innerText = `$${formatCurrency(movingCost)}`;
document.getElementById('entryTotalBadge').innerText = `~$${formatCurrency(totalEntry)} ARS`;

updateChart(totalHousing, totalLiving, surplus > 0 ? surplus : 0);
renderNeighborhoodTable();


}

function initChart() {
const ctx = document.getElementById('budgetChart').getContext('2d');
chartInstance = new Chart(ctx, {
type: 'doughnut',
data: {
labels: ['Vivienda & Servicios', 'Vida Cotidiana & Ocio', 'Margen / Ahorro'],
datasets: [{
data: [650000, 410000, 440000],
backgroundColor: ['#3b82f6', '#f59e0b', '#10b981'],
borderWidth: 0
}]
},
options: {
responsive: true,
maintainAspectRatio: false,
plugins: {
legend: {
position: 'bottom',
labels: { color: '#9ca3af', font: { size: 11 } }
}
},
cutout: '70%'
}
});
}

function updateChart(housing, living, savings) {
if (chartInstance) {
chartInstance.data.datasets[0].data = [housing, living, savings];
chartInstance.update();
}
}

function renderNeighborhoodTable() {
const tbody = document.getElementById('neighborhoodTableBody');
const search = document.getElementById('neighborhoodSearch').value.toLowerCase();
const selectedZone = document.getElementById('zoneFilter').value;
const userIncome = parseFloat(document.getElementById('incomeInput').value) || 1500000;

tbody.innerHTML = '';

const filtered = neighborhoods.filter(n => {
    const matchesSearch = n.name.toLowerCase().includes(search) || n.zone.toLowerCase().includes(search);
    const matchesZone = selectedZone === 'ALL' || n.zone === selectedZone;
    return matchesSearch && matchesZone;
});

filtered.forEach(n => {
    const totalFijo = n.rent + n.expensas;
    const pct = ((totalFijo / userIncome) * 100).toFixed(1);

    let badgeClass = '';
    let badgeText = '';
    if (pct < 35) {
        badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        badgeText = 'Holgado';
    } else if (pct <= 50) {
        badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
        badgeText = 'Viable';
    } else {
        badgeClass = 'bg-red-500/20 text-red-300 border-red-500/30';
        badgeText = 'Inviable';
    }

    const tr = document.createElement('tr');
    tr.className = 'hover:bg-gray-800/40 transition';
    tr.innerHTML = `
        <td class="py-3 px-4 font-semibold text-white">${n.name}</td>
        <td class="py-3 px-4 text-gray-400">${n.zone}</td>
        <td class="py-3 px-4">
            <input type="number" value="${n.rent}" step="10000" onchange="updateNeighborhoodValue('${n.id}', 'rent', this.value)"
                class="w-28 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-right text-gray-200 focus:border-blue-500 focus:outline-none">
        </td>
        <td class="py-3 px-4">
            <input type="number" value="${n.expensas}" step="5000" onchange="updateNeighborhoodValue('${n.id}', 'expensas', this.value)"
                class="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-right text-gray-200 focus:border-blue-500 focus:outline-none">
        </td>
        <td class="py-3 px-4 font-bold text-gray-200">$${formatCurrency(totalFijo)}</td>
        <td class="py-3 px-4 font-bold text-blue-400">${pct}%</td>
        <td class="py-3 px-4 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}">${badgeText}</span>
        </td>
        <td class="py-3 px-4 text-right">
            <button onclick="applyPreset(${userIncome}, ${n.rent}, ${n.expensas}, '${n.id}')" 
                class="px-2.5 py-1 text-xs bg-blue-600/30 hover:bg-blue-600/60 text-blue-300 border border-blue-500/40 rounded transition">
                Cargar
            </button>
        </td>
    `;
    tbody.appendChild(tr);
});


}

function updateNeighborhoodValue(id, field, val) {
const num = parseFloat(val) || 0;
const item = neighborhoods.find(n => n.id === id);
if (item) {
item[field] = num;
updateAllCalculations();
}
}

function resetNeighborhoodData() {
neighborhoods = JSON.parse(JSON.stringify(defaultNeighborhoods));
updateAllCalculations();
}