<template>
    <div class="col-sm-12">
        <div class="col-lg-6 offset-lg-3">
            <page-header
                :header-title="$t( 'log_in' )">
            </page-header>

            <login-form></login-form>
        </div>
        <div class="clearfix"></div>
    </div>
</template>
<script>
import LoginForm from '@cbcAdmin/components/login-form';
export default {
    components : {
        LoginForm
    }
}
</script>