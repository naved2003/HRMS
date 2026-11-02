using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class PayrollConfiguration : IEntityTypeConfiguration<PayrollRecord>
{
    public void Configure(EntityTypeBuilder<PayrollRecord> builder)
    {
        builder.ToTable("PayrollRecords");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Status).HasConversion<int>();
        builder.Property(p => p.GrossSalary).HasColumnType("decimal(18,2)");
        builder.Property(p => p.TotalDeductions).HasColumnType("decimal(18,2)");
        builder.Property(p => p.NetPay).HasColumnType("decimal(18,2)");
        builder.Property(p => p.Remarks).HasMaxLength(500);

        builder.HasOne(p => p.Employee)
               .WithMany(e => e.PayrollRecords)
               .HasForeignKey(p => p.EmployeeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => new { p.EmployeeId, p.Month, p.Year }).IsUnique();

        builder.Property(p => p.ProcessedOn).HasColumnType("datetime2");
    }
}

public class PayslipConfiguration : IEntityTypeConfiguration<Payslip>
{
    public void Configure(EntityTypeBuilder<Payslip> builder)
    {
        builder.ToTable("Payslips");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Basic).HasColumnType("decimal(18,2)");
        builder.Property(p => p.HRA).HasColumnType("decimal(18,2)");
        builder.Property(p => p.Conveyance).HasColumnType("decimal(18,2)");
        builder.Property(p => p.Medical).HasColumnType("decimal(18,2)");
        builder.Property(p => p.SpecialAllowance).HasColumnType("decimal(18,2)");
        builder.Property(p => p.TotalEarnings).HasColumnType("decimal(18,2)");
        builder.Property(p => p.PF).HasColumnType("decimal(18,2)");
        builder.Property(p => p.ESI).HasColumnType("decimal(18,2)");
        builder.Property(p => p.Tax).HasColumnType("decimal(18,2)");
        builder.Property(p => p.TotalDeductions).HasColumnType("decimal(18,2)");
        builder.Property(p => p.NetPay).HasColumnType("decimal(18,2)");

        builder.HasOne(p => p.PayrollRecord)
               .WithOne(r => r.Payslip)
               .HasForeignKey<Payslip>(p => p.PayrollRecordId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(p => p.Employee)
               .WithMany(e => e.Payslips)
               .HasForeignKey(p => p.EmployeeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(p => p.GeneratedOn).HasColumnType("datetime2");
    }
}

public class SalaryStructureConfiguration : IEntityTypeConfiguration<SalaryStructure>
{
    public void Configure(EntityTypeBuilder<SalaryStructure> builder)
    {
        builder.ToTable("SalaryStructures");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Basic).HasColumnType("decimal(18,2)");
        builder.Property(s => s.HRA).HasColumnType("decimal(18,2)");
        builder.Property(s => s.Conveyance).HasColumnType("decimal(18,2)");
        builder.Property(s => s.Medical).HasColumnType("decimal(18,2)");
        builder.Property(s => s.Special).HasColumnType("decimal(18,2)");
        builder.Property(s => s.PF).HasColumnType("decimal(18,2)");
        builder.Property(s => s.ESI).HasColumnType("decimal(18,2)");
        builder.Property(s => s.Tax).HasColumnType("decimal(18,2)");

        builder.HasOne(s => s.Designation)
               .WithMany(d => d.SalaryStructures)
               .HasForeignKey(s => s.DesignationId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.Property(s => s.EffectiveFrom).HasColumnType("date");
    }
}
