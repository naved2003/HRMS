using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Enums;
using HRMS.Services.DTOs;

namespace HRMS.Services.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Departments
        CreateMap<Department, DepartmentDto>()
            .ForMember(d => d.ManagerName, opt => opt.MapFrom(s => s.Manager != null ? $"{s.Manager.FirstName} {s.Manager.LastName}" : null));
        CreateMap<CreateDepartmentDto, Department>();
        CreateMap<UpdateDepartmentDto, Department>();

        // Designations
        CreateMap<Designation, DesignationDto>()
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null));
        CreateMap<CreateDesignationDto, Designation>();
        CreateMap<UpdateDesignationDto, Designation>();

        // Employees
        CreateMap<Employee, EmployeeDto>()
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null))
            .ForMember(d => d.DesignationTitle, opt => opt.MapFrom(s => s.Designation != null ? s.Designation.Title : null));
        CreateMap<Employee, EmployeeListDto>()
            .ForMember(d => d.FullName, opt => opt.MapFrom(s => $"{s.FirstName} {s.LastName}"))
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Department != null ? s.Department.Name : null))
            .ForMember(d => d.DesignationTitle, opt => opt.MapFrom(s => s.Designation != null ? s.Designation.Title : null))
            .ForMember(d => d.Status, opt => opt.MapFrom(s => s.Status.ToString()));
        CreateMap<CreateEmployeeDto, Employee>();
        CreateMap<UpdateEmployeeDto, Employee>();

        // Attendance
        CreateMap<Attendance, AttendanceDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}" : null));
        CreateMap<MarkAttendanceDto, Attendance>();
        // For Update, manual merge done in service to preserve RowVersion behaviour.

        // Leave
        CreateMap<LeaveRequest, LeaveRequestDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}" : null))
            .ForMember(d => d.LeaveTypeName, opt => opt.MapFrom(s => s.LeaveType != null ? s.LeaveType.Name : null))
            .ForMember(d => d.AppliedByName, opt => opt.MapFrom(s => s.AppliedBy != null ? $"{s.AppliedBy.FirstName} {s.AppliedBy.LastName}" : null))
            .ForMember(d => d.ApprovedByName, opt => opt.MapFrom(s => s.ApprovedBy != null ? $"{s.ApprovedBy.FirstName} {s.ApprovedBy.LastName}" : null));
        CreateMap<ApplyLeaveDto, LeaveRequest>();
        CreateMap<LeaveType, LeaveTypeDto>();

        // Payroll
        CreateMap<PayrollRecord, PayrollRecordDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}" : null))
            .ForMember(d => d.DepartmentName, opt => opt.MapFrom(s => s.Employee != null && s.Employee.Department != null ? s.Employee.Department.Name : null))
            .ForMember(d => d.PayslipId, opt => opt.MapFrom(s => s.Payslip != null ? (int?)s.Payslip.Id : null));
        CreateMap<Payslip, PayslipDto>()
            .ForMember(d => d.EmployeeName, opt => opt.MapFrom(s => s.Employee != null ? $"{s.Employee.FirstName} {s.Employee.LastName}" : null))
            .ForMember(d => d.EmployeeCode, opt => opt.MapFrom(s => s.Employee != null ? s.Employee.EmployeeCode : null))
            .ForMember(d => d.Month, opt => opt.MapFrom(s => s.PayrollRecord != null ? s.PayrollRecord.Month : 0))
            .ForMember(d => d.Year, opt => opt.MapFrom(s => s.PayrollRecord != null ? s.PayrollRecord.Year : 0));
        CreateMap<SalaryStructure, SalaryStructureDto>()
            .ForMember(d => d.DesignationTitle, opt => opt.MapFrom(s => s.Designation != null ? s.Designation.Title : null));
        CreateMap<SalaryStructureDto, SalaryStructure>();
    }
}
