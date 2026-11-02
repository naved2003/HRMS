using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HRMS.Infrastructure.Repositories;

public class PayrollRepository : Repository<PayrollRecord>, IPayrollRepository
{
    public PayrollRepository(HRMSDbContext context) : base(context) { }

    public async Task<PayrollRecord?> GetByEmployeeAndMonthYearAsync(int empId, int month, int year)
    {
        return await Context.PayrollRecords
            .Include(p => p.Employee)
            .Include(p => p.Payslip)
            .FirstOrDefaultAsync(p => p.EmployeeId == empId && p.Month == month && p.Year == year);
    }

    public async Task<IEnumerable<PayrollRecord>> GetByMonthYearAsync(int month, int year)
    {
        return await Context.PayrollRecords
            .Include(p => p.Employee)
            .ThenInclude(e => e!.Department)
            .Include(p => p.Payslip)
            .Where(p => p.Month == month && p.Year == year)
            .OrderBy(p => p.Employee!.FirstName)
            .ToListAsync();
    }
}
