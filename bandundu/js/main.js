// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Sample data for projects
const projects = [
    {
        title: "Accès à l'eau potable",
        description: "Un puits a été érigé au sein de l'établissement scolaire Santa Rosa, garantissant un accès continu à une eau potable de qualité pour les élèves et le personnel. Cette ressource précieuse, puisée directement d'une nappe phréatique souterraine, assure non seulement la sécurité sanitaire au sein de l'école mais s'étend également à la communauté avoisinante. En rendant cette eau accessible à tous, nous contribuons significativement à pallier les défis sanitaires engendrés par l'indisponibilité fréquente de l'eau dans le quartier Ufuri à Bandundu.",
        folder: "water",
        image: "images/projects/water/Techniques de pêche.png",
        category: "infrastructure",
        gallery: [
            "images/projects/water/Techniques de pêche.png",
            "images/projects/water/VueAvion.png"
        ]
    },
    {
        title: "Formation en Coupe et Couture",
        description: "La formation en coupe et couture est réalisée au centre NTOBWAVE à Bandundu. L'objectif étant qu'après leurs formations, les filles mères célibataires puissent se réinsérer socialement en se constituant en groupes ou en coopérative pour qu'elles puissent commencer une activité professionnelle. Telema Bandundu fourni et continue de fournir des machines à coudre pour les formations. Les machines sont également disponibles pour les filles au début leurs activités professionnelles.",
        folder: "sewing",
        image: "images/projects/water/VueAvion.png",
        category: "formation",
        gallery: [
            "images/projects/sewing/paysage75.png",
            "images/projects/water/VueAvion.png"
        ]
    },
    {
        title: "Plaine de Jeu",
        description: "Telema Bandundu a contribué à la construction d'une plaine de jeu équipée d'une trampoline, de deux balançoires ainsi que d'un bac à sable, offrant aux enfants un espace de loisirs sécurisé.",
        folder: "playground",
        image: "images/projects/playground/Enfant.jpeg",
        category: "infrastructure",
        gallery: [
            "images/projects/playground/Enfant.jpeg",
            "images/projects/water/VueAvion.png"
        ]
    },
    {
        title: "Formation en Informatique",
        description: "Le centre NTOMBWA de Bandundu dispense des cours de base sur l'utilisation de l'ordinateur aux jeunes désœuvrés de la ville. Afin d'accueillir davantage de jeunes, nous sommes à la recherche de dons d'ordinateurs.",
        folder: "computer",
        image: "images/projects/computer/Enseignement.png",
        category: "formation",
        gallery: [
            "images/projects/computer/Enseignement.png",
            "images/projects/computer/Enseignement2.jpeg",
        ]
    },
    {
        title: "Projet Agroforestier",
        description: "Plantation d'arbres fruitiers et culture vivrière dans la savane N KOWA DIMA NKOWA à 13 km de Bandundu-Centre. Ce projet est actuellement en phase d'étude.",
        folder: "agroforestry",
        image: "images/projects/agroforestry/Techniques de pêche.png",
        category: "environnement",
        gallery: [
            "images/projects/agroforestry/Techniques de pêche.png",
            "images/projects/water/VueAvion.png"
        ]
    },
    {
        title: "Formation en Boulangerie",
        description: "Formation des filles mères célibataires en pâtisserie et boulangerie. Création d'une boulangerie en vue de financer les activités de la maison de jeunesse de Bandundu.",
        folder: "bakery",
        image: "images/projects/bakery/construction.jpeg",
        category: "formation",
        gallery: [
            "images/projects/bakery/construction.jpeg",
            "images/projects/water/VueAvion.png"
        ]
    }
];

// Sample data for team members
const teamMembers = [
    {
        name: "Beerden Luc",
        role: "Conseiller juridique"
    },
        {
        name: "Cosemans Alex",
        role: "Secrétaire"
    },
    {
        name: "Ngazadi Nela",
        role: "Vice-Président / Trésorier"
    },
    {
        name: "Munsi Marie Esther",
        role: "Présidente"
    },
    {
        name: "Munsi Paul",
        role: "Chargé des relations publiques",
        image: "images/team/Paul.png",
        social: {
            email: "paulmunsi@yahoo.fr"
        }
    },
    {
        name: "Masia Patrick",
        role: "Service technique",
        social: {
            email: "munsi@live.be"
        }
    }
    
];

// Function to load projects
function loadProjects(category = 'all') {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = ''; // Clear existing projects
    
    projects.forEach(project => {
        if (category === 'all' || project.category === category) {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description.substring(0, 150)}...</p>
                </div>
            `;
            projectCard.addEventListener('click', () => openProjectModal(project));
            projectsGrid.appendChild(projectCard);
        }
    });
}

// Function to load team members
function loadTeamMembers() {
    const teamGrid = document.querySelector('.team-grid');
    teamGrid.innerHTML = ''; // Clear existing members
    
    teamMembers.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${member.name}">
            <div class="team-member-info">
                <h3 data-member-name="${member.name}">${member.name}</h3>
                <p data-member-role="${member.role}">${member.role}</p>
                <div class="team-member-social">
                    ${member.social.linkedin ? `<a href="${member.social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${member.social.email ? `<a href="mailto:${member.social.email}"><i class="fas fa-envelope"></i></a>` : ''}
                </div>
            </div>
        `;
        teamGrid.appendChild(memberCard);
    });
}

// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('Message sent successfully!');
    this.reset();
});

// Gestion des catégories
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        loadProjects(e.target.dataset.category);
    });
});

// Modal functions
async function openProjectModal(project) {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalGallery = document.getElementById('modalGallery');

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description;
    
    modalGallery.innerHTML = '';
    
    if (project.gallery && project.gallery.length > 0) {
        project.gallery.forEach(imageSrc => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = project.title;
            img.addEventListener('click', () => openFullsizeImage(imageSrc));
            modalGallery.appendChild(img);
        });
    } else {
        // Si pas d'images dans la galerie, afficher au moins l'image principale
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = project.title;
        img.addEventListener('click', () => openFullsizeImage(project.image));
        modalGallery.appendChild(img);
    }

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function openFullsizeImage(imageSrc) {
    const fullsizeImage = document.getElementById('fullsizeImage');
    const fullsizeImageContent = document.getElementById('fullsizeImageContent');
    
    fullsizeImageContent.src = imageSrc;
    fullsizeImage.style.display = 'block';
}

// Close modal events
document.querySelector('.close-modal').addEventListener('click', () => {
    document.getElementById('projectModal').style.display = 'none';
    document.body.style.overflow = 'auto';
});

document.getElementById('fullsizeImage').addEventListener('click', () => {
    document.getElementById('fullsizeImage').style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    const modal = document.getElementById('projectModal');
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    loadCarouselImages();
    loadProjects();
    loadTeamMembers();

    // Menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Navigation active state
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            // Fermer le menu mobile après un clic
            if (window.innerWidth <= 968) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Highlight menu item on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });
});

// Liste statique des images du carousel
const carouselImages = [
    'images/carousel/paysageLong.png',
    'images/carousel/VueAvion.png'
    // Ajoutez ici les chemins vers vos images
];

// Fonction pour charger les images du carousel
function loadCarouselImages() {
    const carousel = document.querySelector('.carousel');
    const carouselNav = document.querySelector('.carousel-nav');
    
    carousel.innerHTML = '';
    carouselNav.innerHTML = '';
    
    carouselImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${image})`;
        carousel.appendChild(slide);

        const dot = document.createElement('div');
        dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        carouselNav.appendChild(dot);
    });

    startCarousel();
}

let currentSlide = 0;
let carouselInterval;

function startCarousel() {
    carouselInterval = setInterval(nextSlide, 5000);
}

function nextSlide() {
    goToSlide((currentSlide + 1) % carouselImages.length);
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = n;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
} 
