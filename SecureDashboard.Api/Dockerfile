# ==========================================
# STAGE 1: Build & Publish
# ==========================================
# We use the heavy SDK image only for compiling the code.
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the project file and restore NuGet packages
COPY ["SecureDashboard.Api.csproj", "./"]
RUN dotnet restore "./SecureDashboard.Api.csproj"

# Copy the rest of the source code and publish the app in Release mode
COPY . .
RUN dotnet publish "SecureDashboard.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ==========================================
# STAGE 2: Runtime Environment
# ==========================================
# We use the much smaller ASP.NET runtime image for production. 
# This reduces the attack surface and image size significantly.
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

# Render.com expects web services to listen on a specific port. 8080 is standard.
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

# Copy the compiled binaries from the Build stage
COPY --from=build /app/publish .

# Define the command that runs when the container starts
ENTRYPOINT ["dotnet", "SecureDashboard.Api.dll"]