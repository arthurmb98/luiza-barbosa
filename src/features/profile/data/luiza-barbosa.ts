import type { Profile } from '@/features/profile/domain/profile'

export const luizaBarbosa: Profile = {
  slug: 'luiza-barbosa',
  name: 'Dra. Luiza Barbosa',
  profession: 'Psicóloga',
  tagline: 'Acolhimento e clareza para cada fase da vida',
  specialties: [
    'Psicoterapia',
    'Ansiedade e estresse',
    'Psicologia clínica',
    'Avaliação e laudos',
    'Perícia psicológica',
    'Psicologia forense',
  ],
  about:
    'Atendo crianças, adolescentes e adultos em um espaço seguro e sem julgamentos. Trabalho com escuta ativa e ferramentas práticas para lidar com ansiedade no dia a dia, dificuldade para dormir, cansaço mental, relações e momentos de transição — para que você saia de cada sessão com mais clareza e leveza. Também atuo com avaliação psicológica, elaboração de laudos e perícia, com experiência em psicologia forense criminal, sempre com rigor técnico e ética profissional.',
  photo: '/photos/luiza-barbosa.jpeg',
  registry: {
    type: 'RNTP',
    number: 'RNTP6963534',
    qrCode: '/qrcodes/RNTP_LUIZA.png',
    qrCodeLabel: 'Validação RNTP',
  },
  whatsapp: '5598981263501',
  whatsappMessage: 'Olá, Dra. Luiza! Vi seu perfil e gostaria de agendar uma conversa.',
  email: 'luizatinoco2606@gmail.com',
  instagram: 'psi_luizabarbosa',
}
