using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employee>
{
    public void Configure(EntityTypeBuilder<Employee> builder)
    {
        builder.ToTable("Employees");
        builder.HasKey(e => e.Id);

        builder.Property(e => e.EmployeeCode)
               .IsRequired()
               .HasMaxLength(20);

        builder.HasIndex(e => e.EmployeeCode).IsUnique();

        builder.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
        builder.Property(e => e.LastName).IsRequired().HasMaxLength(50);
        builder.Property(e => e.Email).IsRequired().HasMaxLength(255);
        builder.Property(e => e.PhoneNumber).HasMaxLength(20);
        builder.Property(e => e.Address).HasMaxLength(500);

        builder.Property(e => e.Gender).HasConversion<int>();
        builder.Property(e => e.EmploymentType).HasConversion<int>();
        builder.Property(e => e.Status).HasConversion<int>();

        builder.Property(e => e.BasicSalary).HasColumnType("decimal(18,2)");

        builder.HasOne(e => e.Department)
               .WithMany(d => d.Employees)
               .HasForeignKey(e => e.DepartmentId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(e => e.Designation)
               .WithMany(d => d.Employees)
               .HasForeignKey(e => e.DesignationId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(e => e.RowVersion).IsRowVersion();

        builder.Property(e => e.HireDate).HasColumnType("date");
        builder.Property(e => e.DateOfBirth).HasColumnType("date");
        builder.Property(e => e.CreatedAt).HasColumnType("datetime2");
        builder.Property(e => e.UpdatedAt).HasColumnType("datetime2");
    }
}
