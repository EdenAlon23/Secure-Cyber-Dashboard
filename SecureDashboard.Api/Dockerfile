# ==========================================
# STAGE 1: Build & Publish (Using .NET 9.0 SDK)
# ==========================================
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy project specification and restore NuGet dependencies
COPY ["SecureDashboard.Api.csproj", "./"]
RUN dotnet restore "./SecureDashboard.Api.csproj"

# Copy remaining source layers and build optimized binaries
COPY . .
RUN dotnet publish "SecureDashboard.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# STAGE 2: Runtime Environment (Using .NET 9.0 ASP.NET Base)
# ==========================================
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Expose network boundary ports for hosting platform (Render standard)
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Extract compiled production artifacts from the builder state
COPY --from=build /app/publish .

# Set execution vector for the isolated container environment
ENTRYPOINT ["dotnet", "SecureDashboard.Api.dll"]