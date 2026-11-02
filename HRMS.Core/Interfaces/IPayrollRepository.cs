using HRMS.Core.Entities;

namespace HRMS.Core.Interfaces;

public interface IPayrollRepository : IRepository<PayrollRecord>
{
    Task<PayrollRecord?> GetByEmployeeAndMonthYearAsync(int empId, int month, int year);
    Task<IEnumerable<PayrollRecord>> GetByMonthYearAsync(int month, int year);
}
