<?php
/**
 * Add this code to your theme's functions.php or a custom plugin
 * This will register a custom REST API endpoint to expose the ACF 'update-text' option field
 */

// Register custom REST API endpoint for the store update text
add_action('rest_api_init', function () {
    register_rest_route('theholyspiritus/v1', '/store-update', [
        'methods' => 'GET',
        'callback' => 'get_store_update_text',
        'permission_callback' => '__return_true' // Public access
    ]);
});

/**
 * Callback function to get the store update text from ACF options
 * 
 * @return WP_REST_Response
 */
function get_store_update_text() {
    // Check if ACF is active and the function exists
    if (function_exists('get_field')) {
        // Get the 'update-text' field from ACF options
        $update_text = get_field('update-text', 'option');
        
        // Return the value if found
        if ($update_text) {
            return new WP_REST_Response([
                'updateText' => $update_text,
                'update_text' => $update_text, // Include both formats for compatibility
            ], 200);
        }
    }
    
    // Return empty string if not found or ACF is not active
    return new WP_REST_Response([
        'updateText' => '',
        'update_text' => '',
        'message' => 'Field not found or ACF is not active'
    ], 200);
}

/**
 * Alternative approach: Register the ACF options with the main ACF REST API
 * This requires the "ACF to REST API" plugin to be installed
 * https://wordpress.org/plugins/acf-to-rest-api/
 */
add_filter('acf/rest_api/options_pages', function ($options_pages) {
    // Make sure the options page is registered with ACF REST API
    if (!isset($options_pages['dashboard-settings'])) {
        $options_pages['dashboard-settings'] = 'dashboard-settings';
    }
    
    return $options_pages;
}); 