from setuptools import setup, find_packages

setup(
    name="digital_brain_agency",
    version="0.1.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    install_requires=[
        "redis>=4.5.5",
        "redlock-py>=1.2.0",
        "pytest>=7.4.0"
    ],
    python_requires=">=3.8",
)