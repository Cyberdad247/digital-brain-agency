import { useState } from 'react'
import { localLLM } from '../integrations/local-llm'

/**
 * Component for selecting LLM provider and model
 * 
 * @remarks
 * This component provides:
 * - Dropdown to select between supported LLM providers (Ollama, LM Studio, GPT4All, Gemini)
 * - Model selection that updates based on chosen provider
 * - Callback to notify parent component of configuration changes
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <LLMProviderSelector onChange={(config) => setLlmConfig(config)} />
 * ```
 */
export const LLMProviderSelector = ({ onChange }) => {
  const [provider, setProvider] = useState('ollama')
  const [model, setModel] = useState(localLLM.models.ollama.models[0])

  /**
   * Handles provider selection changes
   * 
   * @remarks
   * This function:
   * - Updates the selected provider state
   * - Resets model to first available model for new provider
   * - Notifies parent component of configuration change
   */
  const handleProviderChange = (e) => {
    const newProvider = e.target.value
    setProvider(newProvider)
    setModel(localLLM.models[newProvider].models[0])
    onChange({ provider: newProvider, model: localLLM.models[newProvider].models[0] })
  }

  /**
   * Handles model selection changes
   * 
   * @remarks
   * This function:
   * - Updates the selected model state
   * - Notifies parent component of configuration change
   */
  const handleModelChange = (e) => {
    const newModel = e.target.value
    setModel(newModel)
    onChange({ provider, model: newModel })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-pink-500">LLM Provider</label>
        <select
          value={provider}
          onChange={handleProviderChange}
          className="w-full p-2 border border-pink-500 rounded bg-black text-pink-500"
        >
          <option value="ollama">Ollama (localhost:11434)</option>
          <option value="lmstudio">LM Studio</option>
          <option value="gpt4all">GPT4All</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-pink-500">Model</label>
        <select
          value={model}
          onChange={handleModelChange}
          className="w-full p-2 border border-pink-500 rounded bg-black text-pink-500"
        >
          {localLLM.models[provider].models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
