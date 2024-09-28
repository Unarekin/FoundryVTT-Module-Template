describe('template spec', () => {
  it('passes', () => {
    cy.visit('/')

      .selectWorld("blank-test-world")
      .selectUser("Gamemaster")
      .clickMacroButton(1)
  })
})