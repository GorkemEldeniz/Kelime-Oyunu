import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

interface ResetPasswordEmailProps {
	username: string;
	resetLink: string;
}

const ResetPasswordEmail = ({
	username,
	resetLink,
}: ResetPasswordEmailProps) => {
	const currentYear = new Date().getFullYear();

	return (
		<Html>
			<Head />
			<Preview>Kelime Oyunu - Şifre Sıfırlama İsteği</Preview>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								brand: "#6b0aed",
							},
							spacing: {
								0: "0px",
								1: "4px",
								2: "8px",
								3: "12px",
								4: "16px",
								5: "20px",
								6: "24px",
								8: "32px",
							},
							fontSize: {
								sm: ["14px", "20px"],
								base: ["16px", "24px"],
								lg: ["18px", "28px"],
								xl: ["20px", "28px"],
								"2xl": ["24px", "32px"],
							},
						},
					},
				}}
			>
				<Body className='bg-slate-50 font-sans'>
					<Container className='mx-auto my-0 p-5 w-[600px]'>
						<Section className='bg-white rounded-lg shadow-sm p-8 my-5'>
							<Heading className='text-center mb-6 text-2xl font-bold text-slate-900'>
								Kelime Oyunu
							</Heading>
							<Heading className='text-xl font-semibold text-slate-900 mb-4'>
								Şifre Sıfırlama İsteği
							</Heading>
							<Text className='text-slate-600 mb-6 leading-6'>
								Merhaba {username},
							</Text>
							<Text className='text-slate-600 mb-6 leading-6'>
								Hesabınız için bir şifre sıfırlama talebinde bulundunuz.
								Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:
							</Text>
							<Button
								className='bg-brand text-white px-6 py-3 rounded-md font-medium inline-block no-underline hover:bg-brand/90'
								href={resetLink}
							>
								Şifremi Sıfırla
							</Button>
							<Text className='text-slate-600 mb-6 leading-6'>
								Eğer butona tıklayamazsanız, aşağıdaki bağlantıyı tarayıcınıza
								kopyalayabilirsiniz:
							</Text>
							<Text className='text-slate-600 mb-6 leading-6 break-all'>
								<Link className='text-brand no-underline' href={resetLink}>
									{resetLink}
								</Link>
							</Text>
							<Hr className='border-slate-200 my-6' />
							<Text className='text-sm text-slate-500 bg-slate-50 p-4 rounded-md mt-6 leading-6'>
								Bu bağlantı 30 dakika sonra geçerliliğini yitirecektir. Eğer bu
								şifre sıfırlama isteğini siz yapmadıysanız, bu e-postayı
								görmezden gelebilirsiniz.
							</Text>
						</Section>
						<Text className='text-center text-sm text-slate-500 mt-8'>
							© {currentYear} Kelime Oyunu. Tüm hakları saklıdır.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
};

export default ResetPasswordEmail;
