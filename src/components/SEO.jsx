import { Helmet } from 'react-helmet-async'

const SEO = () => {
  const businessSchema = {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "name": "Drive RJM",
    "alternateName": "Drive RJM Ltd",
    "description": "Professional manual driving lessons in Worcester, Malvern & West Worcestershire. Friendly, patient instructor specialising in nervous drivers.",
    "url": "https://www.driverjm.co.uk",
    "logo": "https://www.driverjm.co.uk/logo.png",
    "image": "https://www.driverjm.co.uk/og-image.jpg",
    "telephone": "+447539283257",
    "email": "rowan@driverjm.co.uk",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Orchard House, Orchard Farm, Worcester Road",
      "addressLocality": "Great Witley",
      "addressRegion": "Worcestershire",
      "postalCode": "WR6 6HU",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "52.1936",
      "longitude": "-2.2210"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Worcester"
      },
      {
        "@type": "City",
        "name": "Malvern"
      },
      {
        "@type": "Place",
        "name": "West Worcestershire"
      }
    ],
    "priceRange": "££",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "07:00",
      "closes": "20:00"
    },
    "sameAs": [
      "https://www.driverjm.co.uk",
      "https://www.orchardhousecars.co.uk"
    ]
  }

  const instructorSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Rowan McCann",
    "jobTitle": "Driving Instructor",
    "worksFor": {
      "@type": "DrivingSchool",
      "name": "Drive RJM"
    },
    "description": "Dedicated and passionate driving instructor based in Worcester, specialising in manual driving lessons with particular focus on nervous and unconfident drivers.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Worcester",
      "addressRegion": "Worcestershire",
      "addressCountry": "GB"
    },
    "alumniOf": "8 years automotive industry experience",
    "knowsAbout": [
      "Manual Driving Instruction",
      "Learner Driver Training",
      "Confidence Building",
      "Towing Training",
      "Refresher Courses"
    ]
  }

  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Driving Instruction",
    "provider": {
      "@type": "DrivingSchool",
      "name": "Drive RJM"
    },
    "areaServed": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": "52.1936",
        "longitude": "-2.2210"
      },
      "geoRadius": "30000"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Driving Instruction Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Learner Driver Training",
            "description": "Professional manual driving lessons for beginners and partly-trained students"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Confidence Boosting & Refresher Training",
            "description": "Refresher training for full licence holders who need to rebuild confidence"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Towing Training",
            "description": "Comprehensive towing instruction for trailers and caravans"
          }
        }
      ]
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How many lessons will I need?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typically 25-50 hours of professional instruction. Some need more, some less. We can give you our opinion after an initial 2-hour lesson. Practice between lessons with a friend or family member can help reduce this."
        }
      },
      {
        "@type": "Question",
        "name": "What's the quickest way to pass my test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Apply for your provisional licence before your 17th birthday. Study for and book your theory test for on or shortly after your birthday. Start driving lessons immediately. Once you pass theory, book your practical test."
        }
      },
      {
        "@type": "Question",
        "name": "How often should I take lessons?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend a minimum of two hours per week. Less than this and you risk making little real progress. As you approach your test, increase frequency to ensure you're at test standard."
        }
      },
      {
        "@type": "Question",
        "name": "Should I practice between lessons?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes and no. Complete at least 10 hours with an instructor before practicing with friends or family. After that, gain as much experience as you can. Bad habits learned early are hard to break."
        }
      },
      {
        "@type": "Question",
        "name": "What are your pass rates?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The UK average is 45-50%, while Worcester sits around 50-55%. Approximately 50% of people pass on their first attempt. Our focus is getting you test-ready with the skills you need for life."
        }
      },
      {
        "@type": "Question",
        "name": "Can I start before I've done my theory test?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! Having lessons actually helps with your theory. Learning both in parallel is recommended. However, you can't book your practical test until you've passed theory."
        }
      },
      {
        "@type": "Question",
        "name": "Should I learn in an automatic?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "At present, we only offer manual lessons. With a manual licence, you can drive both manual and automatic cars. Automatic-only licences restrict you for life. A manual licence gives you flexibility for your future."
        }
      },
      {
        "@type": "Question",
        "name": "Which areas do you cover?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We cover all Worcestershire postcodes starting with WR1, WR2, WR3, WR4, WR5, WR6, WR13 and WR14, including Worcester, Malvern, St John's, St Peters, Warndon, Powick, Rushwick, Kempsey, Hallow, Ombersley, Holt Heath, Great Witley, Martley, Broadheath, Bransford, Malvern Link, Great Malvern, Barnards Green and surrounding areas."
        }
      }
    ]
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.driverjm.co.uk"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Driving Lessons Worcester",
        "item": "https://www.driverjm.co.uk#services"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "About",
        "item": "https://www.driverjm.co.uk#about"
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": "Contact",
        "item": "https://www.driverjm.co.uk#contact"
      }
    ]
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Manual Driving Lessons",
    "description": "Professional manual driving instruction in SEAT Leon",
    "brand": {
      "@type": "Brand",
      "name": "Drive RJM"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "availability": "https://schema.org/InStock",
      "url": "https://www.driverjm.co.uk"
    }
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(businessSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(instructorSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(servicesSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
    </Helmet>
  )
}

export default SEO
