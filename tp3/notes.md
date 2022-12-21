## Picking
init() -> enablePicking();

display() -> RegisterForPick(id, object);
	     clearPickRegistration();


## Movimentação da peça

- Linha reta
  - Caso bata suspende o movimento.
  - A outra peça vai para a caixa de peças.
  - Continua o movimento.

- Luz a seguir a peça

## Ambientes

- 2/3 ambientes com cenas diferentes.

## Coisas opcionais (obrigatorias)

- Registar jogadas (queue)
- Desfazer jogada(s)
- Refazer o conjunto total das jogadas (filme ver moodle)

- Countdown de tempo e score atual

## Regras do Jogo

Cada jogador tem 12 discos colocados nos quadrados pretos.

As peças pretas começam o jogo, alternando turnos.

Jogadas:
- Peças andam na diagonal apenas uma casa.
- É se obrigado a capturar uma peça qd possível.
- É possível comer várias peças numa jogada com saltos múltiplos (sendo possível alterar a direção do salto).

Peças evoluem para reis quando chegam à linha final do lado do adversário.
Estas podem mover-se para a frente e para trás.

Fim:
- Jogo acaba quando um dos players fica sem peças.
- Ou quando um jogador faz as mesmas jogadas 3 vezes. Ex: jogada UM -> jogada DOIS -> volta a jogar UM

Turnos têm um limite de 5 minutos, em casos de haver apenas uma jogada o jogador tem 1 minuto.