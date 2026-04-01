# 🤝 Contributing to ASUSOAR

Welcome to the **ASUSOAR** community! As an open-source Security Orchestration, Automation, and Response platform, we highly encourage developers, SOC analysts, and security engineers to get involved. 

From writing new 3rd-party tool integrations to improving the React dashboard layout, your contributions matter.

> **Main Repository Page**: [https://github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR)

## How Can I Contribute?

### 1. **Submit Bugs and Feature Requests**
If you find a bug or have an idea for a new feature, please open an issue in our repository tracker. 
- Try to be as extremely specific as possible when reporting a bug. Provide Docker logs if a container failed.
- For new features, outlining a concrete USE CASE mapping (e.g. *Why does the SOC need this?*) is very helpful.

### 2. **Code Contributions (Pull Requests)**
If you want to dive into the codebase:
1. **Fork** the project at [https://github.com/Masriyan/Asu-SOAR](https://github.com/Masriyan/Asu-SOAR)
2. **Branch** off into your own feature (`git checkout -b feature/AmazingNewIntegration`).
3. **Commit** your changes (`git commit -m 'Added Crowdstrike IOC Upload Node'`).
4. **Push** your branch (`git push origin feature/AmazingNewIntegration`).
5. Open a **Pull Request** onto the main upstream branch.

### 3. **Building New Integrations**
The core power of any SOAR platform is the number of tools it can talk to.
If you are familiar with Python, you can write new HTTP wrappers for external services and drop the API definitions into the `backend/app/integrations/` directory.

### 4. **Writing Documentation**
Improving `README.md`, `FEATURES.md`, or creating tutorials/playbook templates drastically helps new users onboard faster. If you want to document a specific flow you created, feel free!

## Coding Standards

- **Python (Backend)**: We enforce strict typing where possible via `Pydantic` and utilize standard formatting (`black`, `flake8`). Ensure asynchronous endpoints properly utilize `async def`.
- **TypeScript (Frontend)**: We utilize Next.js 14 and TailwindCSS parameters. Try to modularize your UI changes into reusable `<Components />` mapping our `soc-dark` themes before building massive monolithic pages.

## Getting Help

If you run into issues launching your local development environment via `./install.sh`, please reach out via GitHub Issues! We monitor actively.

Thank you for contributing to the open-source security engineering community!
