const calculatePrice = (user, parameters) => {
  const {
    totalOperatingExpenses,
    payrollTaxExpenses,
    wagesAndSalaries,
    totalCostOfGoodsSold,
    employeeHourlyRate,
    desiredPreTaxNetProfitMargin
  } = user.settings
  const {
    hoursWorkedOrEstimatedForJob,
    partsAndMaterials1,
    partsAndMaterials2,
    partsAndMaterials3
  } = parameters

  // Operating Expenses
  // totalOperatingExpenses

  // Labor Expenses
  const totalLaborExpenses = payrollTaxExpenses + wagesAndSalaries

  // Net Operating Expenses
  const netOperatingExpenses = totalOperatingExpenses - totalLaborExpenses

  // Cost of Goods Sold
  // totalCostOfGoodsSold

  // Overhead Multipliers
  const materialOverheadMultiplier = (totalLaborExpenses / totalCostOfGoodsSold) * (netOperatingExpenses / (totalCostOfGoodsSold + totalLaborExpenses)) + 1
  const laborOverheadMultiplier = (totalCostOfGoodsSold / totalLaborExpenses) * (netOperatingExpenses / (totalCostOfGoodsSold + totalLaborExpenses)) + 1

  // Direct Labor
  totalDirectLaborCosts = employeeHourlyRate * hoursWorkedOrEstimatedForJob

  // Job Expenses
  const totalJobExpenses = Number(partsAndMaterials1) + Number(partsAndMaterials2) + Number(partsAndMaterials3)

  // Job Costs
  const totalJobCosts = totalJobExpenses + totalDirectLaborCosts

  // Job Breakeven Price
  const totalPartsPrice = materialOverheadMultiplier * totalJobExpenses
  const totalLaborPrice = laborOverheadMultiplier * totalDirectLaborCosts
  const totalJobPrice = totalPartsPrice + totalLaborPrice

  // Profit
  // desiredPreTaxNetProfitMargin
  const profitMultiplier = -1 / (desiredPreTaxNetProfitMargin - 1)

  // Sale Price to Customer
  const salePriceToCustomer = Math.round(totalJobPrice * profitMultiplier * 100) / 100

  return Promise.resolve(salePriceToCustomer)
}

module.exports = calculatePrice
