import os
import importlib
from typing import Dict, Any

class PluginLoader:
    """
    Dynamically loads Python scripts from the `integrations/` directory.
    This enables the "Marketplace" feature without hardcoding plugin imports.
    """
    def __init__(self):
        self.plugins: Dict[str, Any] = {}
        self.load_plugins()

    def load_plugins(self):
        plugins_dir = os.path.dirname(__file__)
        for filename in os.listdir(plugins_dir):
            if filename.endswith(".py") and filename not in ("__init__.py", "plugin_loader.py", "base.py"):
                module_name = filename[:-3]
                try:
                    module = importlib.import_module(f"app.integrations.{module_name}")
                    if hasattr(module, "run_integration"):
                        self.plugins[module_name] = module.run_integration
                        print(f"[ASUSOAR Plugin Loaded]: {module_name}")
                except Exception as e:
                    print(f"Failed to load integration '{module_name}': {e}")

    def execute_node(self, plugin_name: str, args: dict) -> dict:
        """Executes a dynamic integration mapped to a specific node."""
        if plugin_name not in self.plugins:
             raise ValueError(f"Integration '{plugin_name}' is not installed.")
        return self.plugins[plugin_name](**args)

# Global Loader Singleton
plugin_manager = PluginLoader()
