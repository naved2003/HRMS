using AutoMapper;
using HRMS.Core.Entities;
using HRMS.Core.Interfaces;
using HRMS.Services.DTOs;
using HRMS.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace HRMS.Services.Services;

public sealed class DesignationService : IDesignationService
{
    private readonly IDesignationRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<DesignationService> _logger;

    public DesignationService(IDesignationRepository repository, IMapper mapper, ILogger<DesignationService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<IEnumerable<DesignationDto>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }

    public async Task<DesignationDto?> GetByIdAsync(int id)
    {
        var entity = await _repository.GetByIdAsync(id);
        return entity is null ? null : _mapper.Map<DesignationDto>(entity);
    }

    public async Task<IEnumerable<DesignationDto>> GetByDepartmentAsync(int departmentId)
    {
        var entities = await _repository.GetByDepartmentAsync(departmentId);
        return _mapper.Map<IEnumerable<DesignationDto>>(entities);
    }

    public async Task<DesignationDto> CreateAsync(CreateDesignationDto dto)
    {
        var entity = _mapper.Map<Designation>(dto);
        entity.CreatedAt = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;
        await _repository.AddAsync(entity);
        _logger.LogInformation("Designation created with id {Id}", entity.Id);
        return _mapper.Map<DesignationDto>(entity);
    }

    public async Task<DesignationDto?> UpdateAsync(int id, UpdateDesignationDto dto)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return null;

        existing.Title = dto.Title;
        existing.Code = dto.Code;
        existing.DepartmentId = dto.DepartmentId;
        existing.Grade = dto.Grade;
        existing.MinSalary = dto.MinSalary;
        existing.MaxSalary = dto.MaxSalary;
        existing.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(existing);
        return _mapper.Map<DesignationDto>(existing);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _repository.GetByIdAsync(id);
        if (existing is null) return false;
        await _repository.DeleteAsync(existing);
        return true;
    }
}
