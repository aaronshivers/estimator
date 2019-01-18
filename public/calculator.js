document.getElementById('button').addEventListener('click', (element) => {

  // Operating Expenses
  const totalOperatingExpenses = 87084.17

  // Labor Expenses
  const payrollTaxExpenses = 9834.65
  const wagesAndSalaries = 16452.83

  const totalLaborExpenses = payrollTaxExpenses + wagesAndSalaries

  // Net Operating Expenses
  const netOperatingExpenses = totalOperatingExpenses - totalLaborExpenses

  // Cost of Goods Sold
  const totalCostOfGoodsSold = 66399.30

  // Overhead Multipliers
  const materialOverheadMultiplier = (totalLaborExpenses / totalCostOfGoodsSold) * (netOperatingExpenses / (totalCostOfGoodsSold + totalLaborExpenses)) + 1
  const laborOverheadMultiplier = (totalCostOfGoodsSold / totalLaborExpenses) * (netOperatingExpenses / (totalCostOfGoodsSold + totalLaborExpenses)) + 1

  // Direct Labor
  const employeeHourlyRate = 36
  const hoursWorkedOrEstimatedForJob = parseFloat(document.getElementById('hoursWorkedOrEstimatedForJob').value)

  totalDirectLaborCosts = employeeHourlyRate * hoursWorkedOrEstimatedForJob

  // Job Expenses
  const partsAndMaterials1 = parseFloat(document.getElementById('partsAndMaterials1').value|0)
  const partsAndMaterials2 = parseFloat(document.getElementById('partsAndMaterials2').value|0)
  const partsAndMaterials3 = parseFloat(document.getElementById('partsAndMaterials3').value|0)
  const totalJobExpenses = partsAndMaterials1 + partsAndMaterials2 + partsAndMaterials3

  // Job Costs
  const totalJobCosts = totalJobExpenses + totalDirectLaborCosts

  // Job Breakeven Price
  const totalPartsPrice = materialOverheadMultiplier * totalJobExpenses
  const totalLaborPrice = laborOverheadMultiplier * totalDirectLaborCosts
  const totalJobPrice = totalPartsPrice + totalLaborPrice

  // Profit
  const desiredPreTaxNetProfitMargin = 0.2
  const profitMultiplier = -1 / (desiredPreTaxNetProfitMargin - 1)

  // Sale Price to Customer
  const salePriceToCustomer = totalJobPrice * profitMultiplier

  document.getElementById('salePriceToCustomer').value = Math.round(salePriceToCustomer * 100) / 100
})
