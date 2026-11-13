// Conventional Commits with a required scope: type(scope): subject.
// The local plugin rejects attribution trailers, so commits read as authored by the repo owner.
const attributionPattern =
  /^(co-authored-by|generated-by|signed-off-by: .*(claude|anthropic|copilot|openai|gpt))|claude\.ai|anthropic\.com|generated (with|by) |🤖/im;

module.exports = {
  extends: ['@commitlint/config-conventional'],
  plugins: [
    {
      rules: {
        'no-attribution': (parsed) => [
          !attributionPattern.test(parsed.raw || ''),
          'remove attribution lines (Co-authored-by, tool or AI names, generated-with notes)',
        ],
      },
    },
  ],
  rules: {
    'scope-empty': [2, 'never'],
    'scope-case': [2, 'always', 'kebab-case'],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 100],
    'no-attribution': [2, 'always'],
  },
};
