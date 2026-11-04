# Site GAMEC Oficina Mecânica

Site estático (HTML + CSS + JS), sem build. Basta abrir `index.html` ou subir a pasta inteira para qualquer hospedagem.

## Estrutura (mesmo padrão do template)

```
index.html
css/
  variables.css   ← cores, fontes, espaçamentos (mude a identidade aqui)
  global.css      ← reset, botões, utilitários
  header.css  hero.css  brands.css  services.css  about.css
  process.css  reviews.css  cta.css  faq.css  contact.css  footer.css  floating.css
  luxury.css      ← camada de luxo: paleta preto + laranja, fontes serifadas e animações (carrega por último)
  style.css       ← importa todos os arquivos acima
js/
  menu.js         ← menu mobile + header ao rolar
  main.js         ← "Aberto agora", formulário → WhatsApp, animações
  luxury.js       ← abertura, cursor laranja, partículas, tilt 3D, contadores, FAQ suave
assets/
  images/oficina.jpg   ← FOTO PROVISÓRIA (recorte do Google). Troque por fotos em boa resolução.
  icons/favicon.svg
```

## O que ajustar antes de publicar

1. **Fotos**: substitua `assets/images/oficina.jpg` (mantenha o nome) por uma foto da oficina com pelo menos 1200px de largura.
2. **Serviços**: confirme a lista com o cliente (seção `#servicos` no `index.html`).
3. **Domínio**: troque `https://oficinagamec.com/` nas tags `canonical` e `og:url` pelo endereço final.
4. **Depoimentos reais**: há um modelo comentado na seção `#avaliacoes` — cole 3 avaliações reais do Google (com autorização).
5. **Telefone / WhatsApp / horário**: `js/main.js` (objeto `GAMEC` no topo) controla o número do WhatsApp e o horário do selo "Aberto agora". Os links do HTML também têm o número `5511939013340`.
6. **Sábado**: o site atual só informa segunda a sexta. Se abrirem aos sábados, edite `hours` em `js/main.js`, o FAQ, o contato e o rodapé.

## Visual de luxo

- Cores do laranja (da logo): `--orange`, `--orange-light` e `--orange-deep` no topo de `css/luxury.css`.
- Para voltar ao visual antigo: apague a linha `@import url('luxury.css');` em `css/style.css` e o `<script src="js/luxury.js">` do `index.html`.
- A abertura (logo GAMEC) aparece 1 vez por sessão; ajuste o tempo em `js/luxury.js` (`setTimeout(finish, 1900)`).
- Quem ativa "reduzir movimento" no celular/computador vê o site sem as animações.
