using HRMS.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HRMS.Infrastructure.Configurations;

public class LeaveRequestConfiguration : IEntityTypeConfiguration<LeaveRequest>
{
    public void Configure(EntityTypeBuilder<LeaveRequest> builder)
    {
        builder.ToTable("LeaveRequests");
        builder.HasKey(l => l.Id);

        builder.Property(l => l.Status).HasConversion<int>();
        builder.Property(l => l.NumberOfDays).HasColumnType("decimal(5,2)");
        builder.Property(l => l.Reason).HasMaxLength(1000);
        builder.Property(l => l.ApprovalRemarks).HasMaxLength(1000);

        builder.HasOne(l => l.Employee)
               .WithMany(e => e.LeaveRequests)
               .HasForeignKey(l => l.EmployeeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(l => l.LeaveType)
               .WithMany(lt => lt.LeaveRequests)
               .HasForeignKey(l => l.LeaveTypeId)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(l => l.AppliedBy)
               .WithMany()
               .HasForeignKey(l => l.AppliedById)
               .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(l => l.ApprovedBy)
               .WithMany()
               .HasForeignKey(l => l.ApprovedById)
               .IsRequired(false)
               .OnDelete(DeleteBehavior.Restrict);

        builder.Property(l => l.StartDate).HasColumnType("date");
        builder.Property(l => l.EndDate).HasColumnType("date");
        builder.Property(l => l.AppliedOn).HasColumnType("datetime2");
        builder.Property(l => l.ApprovedOn).HasColumnType("datetime2");
        builder.Property(l => l.CreatedAt).HasColumnType("datetime2");
        builder.Property(l => l.UpdatedAt).HasColumnType("datetime2");
    }
}
