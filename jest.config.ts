import type { Config } from 'jest'
import nextJest from 'next/jest'

const createJestConfig = nextJest({
  dir: './', // Path ke root Next.js project kamu
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',  
    '^@/lib/supabase/(.*)$': '<rootDir>/lib/supabase/$1', 
    // Tambahkan mapping lain jika kamu menggunakan alias lain
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Jika ada file setup jest
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  reporters: [
    "default",
    ["jest-html-reporter", {
      pageTitle: "Test Report",
      outputPath: "./test-report.html",
      // opsional lainnya bisa kamu cek di dokumentasi https://github.com/Hargne/jest-html-reporter
    }]
  ],
}

export default createJestConfig(config)
