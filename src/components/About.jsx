import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Briefcase, Globe, VolumeX, TrendingUp } from 'lucide-react';

// Use a placeholder image path until the actual image is added to your project
import aboutImage from '../assets/Images/AboutBG.jpg'; 
// NOTE: Replace 'about-us-placeholder.jpg' with the actual image file path (e.g., ../assets/Images/mountain-valley.jpg)

// --- Styled Components ---

const SectionWrapper = styled.section`
  padding: 5rem 2rem;
  /* Matching the background gradient from Events.jsx */
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
`;

const TextGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; /* Two columns on md and up */
  }
`;

const TextContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Heading = styled.h2`
  /* Matching the Heading style from Events.jsx */
  font-family: 'Crimson Text', serif;
  font-size: 5rem; /* Adjusted for an 'About' section for a better fit */
  margin-bottom: 2rem;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BodyText = styled.p`
  /* Enhanced for modern look: larger font, better spacing, subtle shadow for depth */
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  color: #5D688A;
  margin: 1.5rem 0;
  line-height: 1.8;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* Subtle text shadow for modernity */
  &:first-child {
    font-weight: 500; /* Slightly bolder intro */
  }
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  height: auto; /* Allow natural height */
  min-height: 600px; /* Larger minimum height for bigger feel */
  margin: 3rem 0;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 4px solid white; /* Adds a clean border */
`;

const AboutImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
`;

const FeatureCard = styled(motion.div)`
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  text-align: left;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #008DDA; /* Accent color from Events buttons */
`;

const FeatureIconWrapper = styled.div`
  color: #4299e1;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.5;
`;

// --- Component ---

const AboutSection = () => {
    // Animation variants for Framer Motion
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <SectionWrapper>
            <ContentContainer>
                {/* Text Section */}
                <Heading>About Rest And Relax</Heading>

                <TextContainer>
                    <TextGrid>
                        <BodyText className='text-justify'>
                            Welcome to <span className='font-bold'> Rest and Relax </span>, your premier destination for unforgettable experiences in the heart of Gujarat! Nestled in the vibrant city of Vadodara, we are dedicated to creating memorable moments for people from all walks of life across India.
                        </BodyText>
                        <BodyText className='text-justify'>
                            Vadodara, a city steeped in culture and history, serves as the perfect backdrop for your special occasions. With its picturesque landscapes and rich heritage, our location offers an ideal escape from the hustle and bustle of everyday life.
                        </BodyText>
                    </TextGrid>
                    <BodyText className='text-justify'>
                        At Rest and Relax, we specialize in a diverse range of services designed to cater to your every need. Whether you’re planning a delightful one-day picnic with family, an elegant wedding destination, or a fun-filled corporate event, we’ve got you covered.
                    </BodyText>
                </TextContainer>
            </ContentContainer>

            {/* Full-width Image Section - Moved outside ContentContainer for full width */}
            <ImageContainer
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
                <AboutImage src={aboutImage} alt="Scenic Valley" />
            </ImageContainer>

            <ContentContainer>
                {/* Features/Value Proposition Grid */}
                <FeaturesGrid
                    as={motion.div}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <FeatureCard variants={itemVariants}>
                        <FeatureIconWrapper><Briefcase size={32} /></FeatureIconWrapper>
                        <FeatureTitle>Amplify Insights</FeatureTitle>
                        <FeatureDescription>
                            Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard variants={itemVariants}>
                        <FeatureIconWrapper><Globe size={32} /></FeatureIconWrapper>
                        <FeatureTitle>Control Your Global Presence</FeatureTitle>
                        <FeatureDescription>
                            Manage and track satellite offices, ensuring consistent performance and streamlined operations everywhere.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard variants={itemVariants}>
                        <FeatureIconWrapper><VolumeX size={32} /></FeatureIconWrapper>
                        <FeatureTitle>Remove Language Barriers</FeatureTitle>
                        <FeatureDescription>
                            Adapt to diverse markets with built-in localization for clear communication and enhanced user experience.
                        </FeatureDescription>
                    </FeatureCard>
                    
                    <FeatureCard variants={itemVariants}>
                        <FeatureIconWrapper><TrendingUp size={32} /></FeatureIconWrapper>
                        <FeatureTitle>Visualize Growth</FeatureTitle>
                        <FeatureDescription>
                            Generate precise, visually compelling reports that illustrate your growth trajectories across all regions.
                        </FeatureDescription>
                    </FeatureCard>
                </FeaturesGrid>
            </ContentContainer>
        </SectionWrapper>
    );
};

export default AboutSection;