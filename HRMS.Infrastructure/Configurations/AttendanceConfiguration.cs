using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class AttendanceConfiguration : IEntityTypeConfiguration<Attendance>
{
    public void Configure(EntityTypeBuilder<Attendance> builder)
    {
        builder.ToTable("Attendance");
        builder.HasKey(a => a.Id);

        builder.Property(a => a.Status).HasConversion<int>();

        builder.Property(a => a.CheckIn).HasColumnType("time(0)");
        builder.Property(a => a.CheckOut).HasColumnType("time(0)");
        builder.Property(a => a.WorkHours).HasColumnType("decimal(5,2)");

        builder.Property(a => a.Date).HasColumnType("date");
        builder.Property(a => a.CreatedAt).HasColumnType("datetime2");

        builder.Property(a => a.Remarks).HasMaxLength(500);

        builder.HasOne(a => a.Employee)
               .WithMany(e => e.Attendance)
               .HasForeignKey(a => a.EmployeeId)
               .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(a => new { a.EmployeeId, a.Date }).IsUnique();
    }
}
