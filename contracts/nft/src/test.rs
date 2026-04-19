#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Env};

    #[test]
    fn test_mint() {
        let env = Env::default();
        env.mock_all_auths();
        let admin = Address::generate(&env);
        let contract_id = env.register_contract(None, NFTContract);
        let client = NFTContractClient::new(&env, &contract_id);

        client.init(&admin);
        let user = Address::generate(&env);
        let id = client.mint(&user, &soroban_sdk::String::from_str(&env, "ipfs://..."));
        assert_eq!(id, 1);
        assert_eq!(client.owner_of(&id), user);
    }
}
