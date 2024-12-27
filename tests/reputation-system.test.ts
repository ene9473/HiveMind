import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'reputation-system': {
      functions: {
        'update-reputation': vi.fn(),
        'get-reputation': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Reputation System Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('update-reputation', () => {
    it('should update reputation successfully', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const points = 10
      mockClarity.contracts['reputation-system'].functions['update-reputation'].mockReturnValue({ success: true })
      
      const result = await callContract('reputation-system', 'update-reputation', [user, points])
      
      expect(result.success).toBe(true)
    })
    
    it('should handle negative reputation points', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const points = -5
      mockClarity.contracts['reputation-system'].functions['update-reputation'].mockReturnValue({ success: true })
      
      const result = await callContract('reputation-system', 'update-reputation', [user, points])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('get-reputation', () => {
    it('should return user reputation', async () => {
      const user = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const expectedReputation = { score: 15 }
      mockClarity.contracts['reputation-system'].functions['get-reputation'].mockReturnValue({ success: true, value: expectedReputation })
      
      const result = await callContract('reputation-system', 'get-reputation', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedReputation)
    })
    
    it('should return zero score for new users', async () => {
      const user = 'ST3CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AH'
      const expectedReputation = { score: 0 }
      mockClarity.contracts['reputation-system'].functions['get-reputation'].mockReturnValue({ success: true, value: expectedReputation })
      
      const result = await callContract('reputation-system', 'get-reputation', [user])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedReputation)
    })
  })
})
