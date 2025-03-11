import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';

export class ConfigValidator {
  async auditConfigs(rootDir?: string): Promise<{
    envIssues: string[];
    configErrors: string[];
    secretExposures: string[];
  }> {
    const results = {
      envIssues: [] as string[],
      configErrors: [] as string[],
      secretExposures: [] as string[],
    };

    try {
      const baseDir = rootDir || process.cwd();

      // Validate .env configuration
      await this.validateEnvConfig(path.join(baseDir, '.env'));

      // Check for secrets in version control
      await this.detectSecretsInGit(baseDir);

      // Validate config file practices
      await this.validateConfigFiles(baseDir);

      return results;
    } catch (error) {
      console.error('Configuration validation failed:', error);
      return results;
    }
  }

  private async validateEnvConfig(envPath: string) {
    try {
      const envFile = await fs.readFile(envPath, 'utf-8');
      const parsed = dotenv.parse(envFile);

      if (!parsed.NODE_ENV) {
        throw new Error('NODE_ENV not specified in .env');
      }

      if (parsed.DATABASE_URL?.includes('localhost')) {
        throw new Error('Potential local database URL in production config');
      }
    } catch (error) {
      throw new Error(`Env validation failed: ${error.message}`);
    }
  }

  private async detectSecretsInGit(rootDir: string) {
    try {
      const gitFolder = path.join(rootDir, '.git');
      const gitConfig = await fs.readFile(path.join(gitFolder, 'config'), 'utf-8');

      if (gitConfig.includes('aws_access_key')) {
        throw new Error('Potential AWS credentials in git config');
      }
    } catch (error) {
      throw new Error(`Secrets detection failed: ${error.message}`);
    }
  }

  private async validateConfigFiles(rootDir: string) {
    try {
      const configFiles = await fs.readdir(path.join(rootDir, 'config'));
      
      if (!configFiles.includes('production.json')) {
        throw new Error('Missing production environment config');
      }

      if (configFiles.some(f => f.endsWith('.sample'))) {
        throw new Error('Sample config files detected in production');
      }
    } catch (error) {
      throw new Error(`Config file validation failed: ${error.message}`);
    }
  }
}