# Schema recipes

Minimal, original starting points. Every value in angle brackets is a placeholder: replace it with a confirmed fact that is visible on the page, or delete the property. Status notes are as of October 2026; re-check Google's documentation before relying on them.

Contents:

1. Organisation and website graph (home page)
2. Charity or nonprofit (`NGO`)
3. Location page (`LocalBusiness`)
4. Breadcrumbs
5. Blog post
6. Event
7. Product
8. Legacy FAQ and HowTo markup
9. PHP: theme- or plugin-owned graph
10. PHP: extending Yoast, Rank Math and SEOPress

## 1. Organisation and website graph (home page)

One organisation node for the whole site. Other pages refer to it by `@id`.

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://example.com/#organization",
      "name": "<Trading Name>",
      "legalName": "<Legal Name Ltd>",
      "url": "https://example.com/",
      "logo": "https://example.com/wp-content/uploads/<logo>.png",
      "sameAs": [
        "https://social.example/<profile>"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+44-0000-000000",
        "email": "hello@example.com"
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://example.com/#website",
      "url": "https://example.com/",
      "name": "<Trading Name>",
      "publisher": { "@id": "https://example.com/#organization" }
    }
  ]
}
```

Notes: Google no longer shows the sitelinks search box (since November 2024), so a `potentialAction` `SearchAction` is optional. `WebSite` with `name` still helps Google choose the site name.

## 2. Charity or nonprofit (`NGO`)

`NGO` is a schema.org subtype of `Organization`. Use the `nonprofitStatus` value that matches the regulator's record, or leave it out. Google does not list `nonprofitStatus` among its Organization properties, so treat it as accurate description only.

```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": "https://example.org/#organization",
  "name": "<Charity Name>",
  "url": "https://example.org/",
  "logo": "https://example.org/wp-content/uploads/<logo>.png",
  "nonprofitStatus": "https://schema.org/CharitableIncorporatedOrganization",
  "identifier": {
    "@type": "PropertyValue",
    "propertyID": "<Regulator name> charity number",
    "value": "<charity-number>"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<street>",
    "addressLocality": "<town>",
    "postalCode": "<postcode>",
    "addressCountry": "GB"
  }
}
```

UK `nonprofitStatus` values on schema.org: `CharitableIncorporatedOrganization`, `LimitedByGuaranteeCharity`, `UKTrust`, `UnincorporatedAssociationCharity`.

## 3. Location page (`LocalBusiness`)

Use the most specific subtype that is true (for example `Dentist`, `Plumber`, `LegalService`). Google requires `name` and `address`. A service-area business that hides its address on its profile may be better described with `Organization` and `areaServed` than with an address it does not want shown.

```json
{
  "@context": "https://schema.org",
  "@type": "<LocalBusinessSubtype>",
  "@id": "https://example.com/locations/<place>/#location",
  "name": "<Trading Name> <Place>",
  "url": "https://example.com/locations/<place>/",
  "telephone": "+44-0000-000000",
  "image": "https://example.com/wp-content/uploads/<storefront>.jpg",
  "parentOrganization": { "@id": "https://example.com/#organization" },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "<street>",
    "addressLocality": "<town>",
    "postalCode": "<postcode>",
    "addressCountry": "GB"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 0.00000,
    "longitude": 0.00000
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "09:00",
      "closes": "17:00"
    }
  ],
  "areaServed": ["<town>", "<postcode district>"]
}
```

Do not add `aggregateRating` or `review` for the business's own reviews. Google treats them as self-serving and they are not eligible.

## 4. Breadcrumbs

Only where the page shows the same breadcrumb trail. The last item may omit `item`.

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "<Section>", "item": "https://example.com/<section>/" },
    { "@type": "ListItem", "position": 3, "name": "<Page title>" }
  ]
}
```

## 5. Blog post

```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://example.com/<post-slug>/#article",
  "headline": "<Visible post title>",
  "image": ["https://example.com/wp-content/uploads/<featured>.jpg"],
  "datePublished": "2026-10-01T09:00:00+01:00",
  "dateModified": "2026-10-15T14:30:00+01:00",
  "author": {
    "@type": "Person",
    "name": "<Author Name>",
    "url": "https://example.com/author/<author-slug>/"
  },
  "publisher": { "@id": "https://example.com/#organization" },
  "mainEntityOfPage": "https://example.com/<post-slug>/"
}
```

Use the post's real dates from WordPress (`get_the_date( DATE_W3C )`, `get_the_modified_date( DATE_W3C )`), not the build date.

## 6. Event

For a real event with a date and place. Update `eventStatus` if it is cancelled or moved, rather than deleting the page. Google removed its online-event properties from the docs in June 2025; describe online events accurately but do not expect an online-event feature.

```json
{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "<Event name>",
  "description": "<One-sentence visible summary>",
  "startDate": "2026-11-20T18:30:00+00:00",
  "endDate": "2026-11-20T20:30:00+00:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "image": ["https://example.com/wp-content/uploads/<event>.jpg"],
  "location": {
    "@type": "Place",
    "name": "<Venue name>",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "<street>",
      "addressLocality": "<town>",
      "postalCode": "<postcode>",
      "addressCountry": "GB"
    }
  },
  "organizer": { "@id": "https://example.com/#organization" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/events/<event-slug>/",
    "price": "0",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "validFrom": "2026-10-01T09:00:00+01:00"
  }
}
```

## 7. Product

If WooCommerce or the SEO plugin already outputs `Product`, extend that rather than adding a second node. Merchant listings need more than this (shipping and returns details); check Google's current merchant listing documentation.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "<Product name>",
  "image": ["https://example.com/wp-content/uploads/<product>.jpg"],
  "description": "<Visible product description>",
  "sku": "<sku>",
  "brand": { "@type": "Brand", "name": "<Brand>" },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/shop/<product-slug>/",
    "price": "00.00",
    "priceCurrency": "GBP",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition"
  }
}
```

Add `aggregateRating` or `review` only for genuine customer reviews shown on the page, with any incentive disclosed.

## 8. Legacy FAQ and HowTo markup

- **FAQPage**: Google stopped showing FAQ rich results on 7 May 2026. Do not add new FAQ markup to win a Google feature. Existing markup that matches visible questions and answers does no harm and can stay; removing it is optional and needs the user's approval.
- **HowTo**: deprecated by Google since September 2023. No recipe is given. Leave existing markup or remove it with approval; it does not cause errors.

If the user still wants `FAQPage` for other consumers, it must mirror the visible questions and answers word for word:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<Visible question?>",
      "acceptedAnswer": { "@type": "Answer", "text": "<Visible answer.>" }
    }
  ]
}
```

## 9. PHP: theme- or plugin-owned graph

Use this only when no SEO plugin owns schema, or its schema output has been turned off with approval. Put it in a small site plugin, not `functions.php`.

```php
<?php
/**
 * Plugin Name: Example Site Schema
 * Description: Outputs the organisation and website graph on the home page.
 */

add_action( 'wp_head', function () {
	if ( ! is_front_page() ) {
		return;
	}

	$org_id  = home_url( '/#organization' );
	$logo_id = (int) get_theme_mod( 'custom_logo' );

	$organization = array_filter( array(
		'@type' => 'Organization',
		'@id'   => $org_id,
		'name'  => get_bloginfo( 'name' ),
		'url'   => home_url( '/' ),
		'logo'  => $logo_id ? wp_get_attachment_image_url( $logo_id, 'full' ) : null,
	) );

	$graph = array(
		'@context' => 'https://schema.org',
		'@graph'   => array(
			$organization,
			array(
				'@type'     => 'WebSite',
				'@id'       => home_url( '/#website' ),
				'url'       => home_url( '/' ),
				'name'      => get_bloginfo( 'name' ),
				'publisher' => array( '@id' => $org_id ),
			),
		),
	);

	// JSON_HEX_TAG stops "</script>" in any value from closing the element.
	wp_print_inline_script_tag(
		wp_json_encode( $graph, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG ),
		array( 'type' => 'application/ld+json' )
	);
} );
```

For post titles, read the raw field (`get_post_field( 'post_title', $post_id )`) and strip tags, rather than `get_the_title()`, which can return HTML entities.

## 10. PHP: extending Yoast, Rank Math and SEOPress

Hook names are as of October 2026. Check each plugin's developer documentation for the current names and arguments before use.

### Yoast SEO: turn the organisation into an `NGO`

```php
add_filter( 'wpseo_schema_organization', function ( $data ) {
	$data['@type']           = array( 'Organization', 'NGO' );
	$data['nonprofitStatus'] = 'https://schema.org/<UKNonprofitTypeValue>';
	$data['identifier']      = array(
		'@type'      => 'PropertyValue',
		'propertyID' => '<Regulator name> charity number',
		'value'      => '<charity-number>',
	);
	return $data;
} );
```

Keep the confirmed number in an option or constant set by the site owner, not hard-coded in a shared plugin.

### Rank Math: add an `Event` node on event posts

```php
add_filter( 'rank_math/json_ld', function ( $data, $jsonld ) {
	if ( ! is_singular( '<event-post-type>' ) ) {
		return $data;
	}
	$post_id = get_the_ID();
	$start   = get_post_meta( $post_id, '<start-meta-key>', true );

	if ( ! $start ) {
		return $data; // No confirmed date, no Event markup.
	}

	$data['exampleEvent'] = array(
		'@type'       => 'Event',
		'name'        => wp_strip_all_tags( get_post_field( 'post_title', $post_id ) ),
		'startDate'   => $start,
		'eventStatus' => 'https://schema.org/EventScheduled',
		'url'         => get_permalink( $post_id ),
		'organizer'   => array( '@id' => home_url( '/#organization' ) ),
	);
	return $data;
}, 99, 2 );
```

Rank Math encodes the final array itself, so return arrays, not JSON strings.

### SEOPress: change the organisation node

```php
// Confirm the arguments on https://www.seopress.org/support/hooks/ before use.
add_filter( 'seopress_get_json_data_organization', function ( $data ) {
	if ( is_array( $data ) ) {
		$data['@type'] = 'NGO';
	}
	return $data;
} );
```

After any change, re-run the detection step in the skill and confirm there is still exactly one organisation node.
